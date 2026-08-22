import cv2
from pathlib import Path

from ai.detector import PersonDetector
from ai.events import create_event


ENTRY_FOLDER = Path("test_images/entry")
EXIT_FOLDER = Path("test_images/exit")


def get_images(folder):
    images = []

    for extension in ("*.jpg", "*.jpeg", "*.png"):
        images.extend(folder.glob(extension))

    return sorted(images)


def process_folder(detector, folder, direction):
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

        result, person_count = detector.detect(image)

        total_people += person_count

        print(
            f"{image_path.name:<25}"
            f"People detected: {person_count}"
        )

        annotated_image = result.plot()

        cv2.imshow(
            f"{direction.upper()} Detection",
            annotated_image
        )

        key = cv2.waitKey(1000)

        if key == ord("q"):
            break

    return total_people


def main():

    detector = PersonDetector()

    print("\n======================================")
    print("       CROWD MANAGEMENT SYSTEM")
    print("======================================")

    # -------------------------
    # ENTRY
    # -------------------------

    entry_count = process_folder(
        detector,
        ENTRY_FOLDER,
        "entry"
    )

    # -------------------------
    # EXIT
    # -------------------------

    exit_count = process_folder(
        detector,
        EXIT_FOLDER,
        "exit"
    )

    cv2.destroyAllWindows()

    # -------------------------
    # CROWD CALCULATION
    # -------------------------

    current_crowd = max(
        0,
        entry_count - exit_count
    )

    entered_today = entry_count
    exited_today = exit_count

    # -------------------------
    # EVENTS
    # -------------------------

    if entry_count > 0:

        entry_event = create_event(
            camera_id="ENTRY_01",
            gate_id="GATE_1",
            direction="entry",
            count=entry_count
        )

        print("\nENTRY EVENT")
        print(entry_event)

    if exit_count > 0:

        exit_event = create_event(
            camera_id="EXIT_01",
            gate_id="GATE_1",
            direction="exit",
            count=exit_count
        )

        print("\nEXIT EVENT")
        print(exit_event)

    # -------------------------
    # FINAL STATUS
    # -------------------------

    print("\n======================================")
    print("             CROWD STATUS")
    print("======================================")

    print(f"TOTAL ENTRY      : {entry_count}")
    print(f"TOTAL EXIT       : {exit_count}")
    print(f"CURRENT CROWD    : {current_crowd}")
    print(f"ENTERED TODAY    : {entered_today}")
    print(f"EXITED TODAY     : {exited_today}")

    print("======================================\n")


if __name__ == "__main__":
    main()