import cv2
from pathlib import Path

from ai.detector import PersonDetector


IMAGE_FOLDER = Path("test_images")


def main():
    detector = PersonDetector()

    image_files = []

    for extension in ("*.jpg", "*.jpeg", "*.png"):
        image_files.extend(IMAGE_FOLDER.glob(extension))

    image_files = sorted(image_files)

    if not image_files:
        print("No images found in test_images/")
        print("Add JPG, JPEG, or PNG images and run again.")
        return

    total_people = 0

    print("\n===================================")
    print(" SNAPSHOT CROWD COUNTER")
    print("===================================\n")

    for image_path in image_files:

        image = cv2.imread(str(image_path))

        if image is None:
            print(f"[ERROR] Could not read: {image_path.name}")
            continue

        result, person_count = detector.detect(image)

        total_people += person_count

        # Draw detection results
        annotated_image = result.plot()

        print(
            f"{image_path.name:<25} "
            f"People detected: {person_count}"
        )

        cv2.imshow("Snapshot Detection", annotated_image)

        key = cv2.waitKey(1000)

        if key == ord("q"):
            break

    cv2.destroyAllWindows()

    print("\n===================================")
    print(f" TOTAL PEOPLE: {total_people}")
    print("===================================\n")


if __name__ == "__main__":
    main()