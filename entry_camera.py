"""
AI-Based Real-Time Crowd Counting and Management System
Stage 1: Entry Camera Prototype

Requirements & Features:
1. Python + OpenCV + Ultralytics YOLOv8 + ByteTrack.
2. Uses laptop's built-in webcam (`cv2.VideoCapture(0)`).
3. Detects ONLY people (`classes=[0]`).
4. Displays bounding box and temporary tracking ID per person.
5. Draws horizontal virtual counting line across frame center.
6. Counts a person when their center point crosses the counting line.
7. Prevents duplicate counting for the same tracking ID using a `set`.
8. Displays live ENTRY COUNT banner on-screen.
9. Press 'Q' or 'q' to close camera and exit cleanly.
10. NO facial recognition, NO face database, NO registration, NO biometric storage.
"""

import cv2
import numpy as np
from ultralytics import YOLO


def main():
    # ----------------------------------------------------
    # 1. Initialize YOLO Model & Camera Source
    # ----------------------------------------------------
    # Load lightweight YOLOv8 nano model (downloads automatically on first run)
    model = YOLO("yolov8n.pt")

    # Open the laptop's default webcam (Index 0)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("[ERROR] Could not open webcam. Please check camera access and try again.")
        return

    # Set camera resolution (optional, adjust if needed)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # ----------------------------------------------------
    # 2. Tracking & Counting State Variables
    # ----------------------------------------------------
    entry_count = 0                     # Total unique persons counted crossing line
    counted_ids = set()                # Store IDs already counted to prevent duplicates
    track_history = {}                 # Track previous y-coordinate center: {track_id: prev_cy}

    print("[INFO] Starting Entry Camera Prototype...")
    print("[INFO] Position yourself in front of the camera and cross the red virtual line.")
    print("[INFO] Press 'Q' in the camera window to quit.")

    # ----------------------------------------------------
    # 3. Live Video Capture & Inference Loop
    # ----------------------------------------------------
    while True:
        ret, frame = cap.read()
        if not ret:
            print("[WARNING] Failed to grab frame from webcam.")
            break

        height, width = frame.shape[:2]

        # Define horizontal virtual counting line (at 50% frame height)
        line_y = int(height * 0.5)

        # Run YOLO object detection & ByteTrack object tracking
        # Filter for person class ONLY (class 0 in COCO dataset)
        results = model.track(
            source=frame,
            persist=True,
            tracker="bytetrack.yaml",
            classes=[0],
            verbose=False
        )

        # Process detections & tracked objects
        if results and results[0].boxes is not None and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            track_ids = results[0].boxes.id.int().cpu().numpy()

            for box, track_id in zip(boxes, track_ids):
                x1, y1, x2, y2 = map(int, box)

                # Calculate center point (cx, cy) of person bounding box
                cx = int((x1 + x2) / 2)
                cy = int((y1 + y2) / 2)

                # Check if person crossed the virtual line
                if track_id in track_history:
                    prev_cy = track_history[track_id]

                    # Detect line crossing (from top-to-bottom or bottom-to-top)
                    if (prev_cy < line_y <= cy) or (prev_cy > line_y >= cy):
                        # Count ONLY if this tracking ID hasn't been counted yet
                        if track_id not in counted_ids:
                            entry_count += 1
                            counted_ids.add(track_id)
                            print(f"[ENTRY DETECTED] Person ID {track_id} crossed the line! Total Count: {entry_count}")

                # Update tracking history with current center y-coordinate
                track_history[track_id] = cy

                # Determine box color (Green if counted, Cyan/Yellow if detected)
                box_color = (0, 255, 0) if track_id in counted_ids else (255, 200, 0)

                # Draw bounding box around detected person
                cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 2)

                # Draw center point dot
                cv2.circle(frame, (cx, cy), 5, (0, 0, 255), -1)

                # Draw temporary tracking ID tag above bounding box
                id_label = f"ID: {track_id}"
                cv2.putText(
                    frame,
                    id_label,
                    (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    box_color,
                    2,
                    cv2.LINE_AA
                )

        # ----------------------------------------------------
        # 4. Drawing Overlays (Virtual Line & Count Display)
        # ----------------------------------------------------
        # Draw horizontal virtual counting line across the frame
        cv2.line(frame, (0, line_y), (width, line_y), (0, 0, 255), 3)
        cv2.putText(
            frame,
            "VIRTUAL ENTRY LINE",
            (20, line_y - 12),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 255),
            2,
            cv2.LINE_AA
        )

        # Draw dark semi-transparent HUD banner for Live Entry Count
        hud_overlay = frame.copy()
        cv2.rectangle(hud_overlay, (15, 15), (350, 95), (0, 0, 0), -1)
        cv2.addWeighted(hud_overlay, 0.65, frame, 0.35, 0, frame)

        # Live Entry Count Text
        cv2.putText(
            frame,
            f"LIVE ENTRY COUNT: {entry_count}",
            (30, 52),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2,
            cv2.LINE_AA
        )

        # Exit Instructions Text
        cv2.putText(
            frame,
            "Press 'Q' to Close Camera",
            (30, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (200, 200, 200),
            1,
            cv2.LINE_AA
        )

        # Display the output window
        cv2.imshow("AI Crowd Management - Entry Camera Prototype", frame)

        # ----------------------------------------------------
        # 5. Handle Keyboard Controls
        # ----------------------------------------------------
        # Exit when 'Q' or 'q' key is pressed
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == ord('Q'):
            print("[INFO] Closing camera application...")
            break

    # ----------------------------------------------------
    # 6. Cleanup & Release Resources
    # ----------------------------------------------------
    cap.release()
    cv2.destroyAllWindows()
    print(f"[SUMMARY] Prototype closed. Total entries recorded: {entry_count}")


if __name__ == "__main__":
    main()
