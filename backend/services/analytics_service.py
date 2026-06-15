import json

def load_data():
    with open("data/sample_data.json") as f:
        return json.load(f)

def get_waste_summary():
    data = load_data()

    total_prepared = sum(x["prepared"] for x in data)
    total_wasted = sum(x["wasted"] for x in data)

    waste_percent = round(
        (total_wasted / total_prepared) * 100,
        2
    )

    return {
        "prepared": total_prepared,
        "wasted": total_wasted,
        "waste_percent": waste_percent
    }