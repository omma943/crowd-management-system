from ultralytics import YOLO


class PersonDetector:
    def __init__(self, model_path="yolov8n.pt", confidence=0.5):
        self.model = YOLO(model_path)
        self.confidence = confidence

    def detect(self, image):
        """
        Detect people in a single image.

        Returns:
            results: YOLO detection results
            person_count: number of detected people
        """

        results = self.model.predict(
            source=image,
            classes=[0],          # COCO class 0 = person
            conf=self.confidence,
            verbose=False
        )

        result = results[0]

        if result.boxes is None:
            return result, 0

        person_count = len(result.boxes)

        return result, person_count