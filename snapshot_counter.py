import cv2
from pathlib import Path

from ai.detector import PersonDetector
from ai.events import create_event

from analytics.database import (
    initialize_database,
    save_event,
    get_today_counts
)


ENTRY_FOLDER = Path("test_images/entry")
EXIT_FOLDER = Path("test_images/exit")


def get_images(folder):
    """Get all supported images from a folder."""

    images = []

    for extension in ("*.jpg", "*.jpeg", "*.png"):
        images.extend(folder.glob(extension))

    return sorted(images)


def process_folder(detector, folder, direction):
    """
    Process all snapshots from an entry or exit folder.

    Returns:
        Total number of people detected.
    """

    images = get_images(folder)

    total_people = 0

    print(f"\n========== {direction.upper()} ==========")

    if not images:
        print(f"No images found in {folder}")
        return 0

    for image_path in images:

        image = cv2.imread(str(image_path))

        if image is None:
            print(f"[ERROR] Could not read: {image_path.name}")
            continue

        # Detect people
        result, person_count = detector.detect(image)

        total_people += person_count

        print(
            f"{image_path.name:<25}"
            f"People detected: {person_count}"
        )

        # Draw YOLO detection boxes
        annotated_image = result.plot()

        cv2.imshow(
            f"{direction.upper()} Detection",
            annotated_image
        )

        # Display image for 1 second
        key = cv2.waitKey(1000)

        if key == ord("q"):
            break

    return total_people


def main():

    # ----------------------------------
    # INITIALIZE DATABASE
    # ----------------------------------

    initialize_database()

    # ----------------------------------
    # INITIALIZE YOLO
    # ----------------------------------

    detector = PersonDetector()

    print("\n======================================")
    print("       CROWD MANAGEMENT SYSTEM")
    print("======================================")

    # ----------------------------------
    # PROCESS ENTRY SNAPSHOTS
    # ----------------------------------

    entry_count = process_folder(
        detector,
        ENTRY_FOLDER,
        "entry"
    )

    # ----------------------------------
    # PROCESS EXIT SNAPSHOTS
    # ----------------------------------

    exit_count = process_folder(
        detector,
        EXIT_FOLDER,
        "exit"
    )

    cv2.destroyAllWindows()

    # ----------------------------------
    # SAVE ENTRY EVENT
    # ----------------------------------

    if entry_count > 0:

        entry_event = create_event(
            camera_id="ENTRY_01",
            gate_id="GATE_1",
            direction="entry",
            count=entry_count
        )

        save_event(
            camera_id="ENTRY_01",
            gate_id="GATE_1",
            direction="entry",
            count=entry_count
        )

        print("\nENTRY EVENT:")
        print(entry_event)

    # ----------------------------------
    # SAVE EXIT EVENT
    # ----------------------------------

    if exit_count > 0:

        exit_event = create_event(
            camera_id="EXIT_01",
            gate_id="GATE_1",
            direction="exit",
            count=exit_count
        )

        save_event(
            camera_id="EXIT_01",
            gate_id="GATE_1",
            direction="exit",
            count=exit_count
        )

        print("\nEXIT EVENT:")
        print(exit_event)

    # ----------------------------------
    # GET TODAY'S PERSISTENT COUNTS
    # ----------------------------------

    entered_today, exited_today = get_today_counts()

    # ----------------------------------
    # CURRENT CROWD
    # ----------------------------------

    current_crowd = max(
        0,
        entered_today - exited_today
    )

    # ----------------------------------
    # DISPLAY CROWD STATUS
    # ----------------------------------

    print("\n======================================")
    print("             CROWD STATUS")
    print("======================================")

    print(f"ENTERED TODAY : {entered_today}")
    print(f"EXITED TODAY  : {exited_today}")
    print(f"CURRENT CROWD : {current_crowd}")

    print("======================================\n")


if __name__ == "__main__":
    main()