class ImageService:

    def process_image(self, image_name):

        return {
            "status": "success",
            "detected_food": [
                "rice",
                "vegetables",
                "bread"
            ],
            "estimated_waste_kg": 2.4,
            "confidence": 87
        }