from matplotlib import image


class ImageService:

    def process_image(self, image_name):

        detected_food = [
            "rice",
            "vegetables",
            "bread"
        ]

        estimated_waste_kg = 2.4
        confidence = 87

        requires_human_verification = confidence < 95

        return {
            "status": "success",
            "image": str(image.filename),
            "detected_food": detected_food,
            "estimated_waste_kg": estimated_waste_kg,
            "confidence": confidence,

            "requires_human_verification":
                requires_human_verification,

            "verification_questions": [
                {
                    "question":
                    "Is the detected food correct?",
                    "type": "yes_no"
                },
                {
                    "question":
                    "Is this edible food waste?",
                    "type": "yes_no"
                },
                {
                    "question":
                    "What caused the waste?",
                    "type": "multiple_choice",
                    "options": [
                        "Overproduction",
                        "Spoilage",
                        "Plate Waste",
                        "Storage Issue"
                    ]
                }
            ],

            "next_step":
            "Human review required before analytics update"
        }