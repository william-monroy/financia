import pandas as pd
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/calculateScore', methods=['GET'])
def calculateScore():
    print("calculateScore")
    args = request.args
    investor_profile = args['investor_profile']
    # Load the provided Excel file
    data = pd.read_excel("data/dataset.xlsx")

    # Exploring unique values in the 'calif.', 'Composición', and 'Serie' columns
    unique_values = {
        "calif.": data["calif."].unique(),
        "Composición": data["Composición"].unique(),
        "Serie": data["Serie"].unique()
    }

    # Step 1: Data Preprocessing

    # Handle missing values: Fill NaN values with appropriate placeholders
    data.fillna({"calif.": "Unknown", "Composición": "Unknown", "Serie": "Unknown"}, inplace=True)

    # Convert categorical features to numerical values using encoding methods
    # For simplicity, we'll use label encoding for "calif.", "Composición", and "Serie"

    label_encoders = {}
    for column in ["calif.", "Composición", "Serie"]:
        le = LabelEncoder()
        data[column] = le.fit_transform(data[column])
        label_encoders[column] = le

    def score_capital_preservation(row):
        """Calculate score for Capital Preservation profile."""
        score = 0
        # Prioritize high ratings
        if row["calif."] in [6]:  # 'AAA...' ratings
            score += 3
        # Emphasize certain compositions
        if row["Composición"] in [9, 10, 14, 15]:  # 'Liquidez Dólares', 'Liquidez Euros', etc.
            score += 3
        # Look for positive short-term performance
        if row["1 Día"] > 0:
            score += 1
        if row["Mes"] > 0:
            score += 1
        return score

    def score_conservative(row):
        """Calculate score for Conservative profile."""
        score = 0
        # Emphasize certain compositions
        if row["Composición"] in [11, 6, 16]:  # 'Estrategia Conservador', 'Renta Fija Corto Plazo Pesos', etc.
            score += 3
        # Moderate to good long-term performance
        if row["12 Meses"] > 0:
            score += 1
        if row["36 Meses"] > 0:
            score += 1
        return score

    def score_moderate(row):
        """Calculate score for Moderate profile."""
        score = 0
        # Emphasize certain compositions
        if row["Composición"] in [12, 8, 9]:  # 'Estrategia Moderado', 'Renta Fija Mediano Plazo México', etc.
            score += 3
        # Good balance between short-term and long-term performance
        if row["3 Meses"] > 0:
            score += 1
        if row["12 Meses"] > 0:
            score += 1
        return score

    def score_balanced(row):
        """Calculate score for Balanced profile."""
        score = 0
        # Emphasize certain compositions
        if row["Composición"] in [5, 7]:  # 'Multiactivos Discrecional', 'Renta Fija Corporativa Mexico'
            score += 3
        # Balanced short-term and long-term performance
        if row["3 Meses"] > 0:
            score += 1
        if row["12 Meses"] > 0:
            score += 1
        return score

    def score_growing(row):
        """Calculate score for Growing profile."""
        score = 0
        # Prioritize certain compositions
        if row["Composición"] in [3, 4, 2, 13]:  # 'Acciones México', 'Acciones Seleccionadas México', etc.
            score += 3
        # Emphasize strong long-term performance
        if row["12 Meses"] > 0:
            score += 2
        if row["36 Meses"] > 0:
            score += 2
        return score

    # Apply the scoring functions to the dataset
    data["score_capital_preservation"] = data.apply(score_capital_preservation, axis=1)
    data["score_conservative"] = data.apply(score_conservative, axis=1)
    data["score_moderate"] = data.apply(score_moderate, axis=1)
    data["score_balanced"] = data.apply(score_balanced, axis=1)
    data["score_growing"] = data.apply(score_growing, axis=1)

    if(investor_profile == "Preservacion de capital"):
        investor_profile = "score_capital_preservation"
    elif(investor_profile == "Conservador"):
        investor_profile = "score_conservative"
    elif(investor_profile == "Moderado"):
        investor_profile = "score_moderate"
    elif(investor_profile == "Balanceado"):
        investor_profile = "score_balanced"
    elif(investor_profile == "Crecimiento"):
        investor_profile = "score_growing"

    # Display the first few rows with the calculated scores
    data[["Fondo", "score_capital_preservation", "score_conservative", "score_moderate", "score_balanced", "score_growing"]].head()
    # Sorting the dataset based on the "score_balanced" column in descending order
    sorted_data_balanced = data.sort_values(by=investor_profile, ascending=False)

    # Retrieving the top 5 funds for the "Balanced" investor profile
    top_5_recommendations_balanced = sorted_data_balanced[["Fondo", investor_profile]].head(5)

    print(top_5_recommendations_balanced)
    result = {"recomendations": []}
    unique_values = {}
    for index, row in top_5_recommendations_balanced.iterrows():
        if not(row["Fondo"] in unique_values):
            result["recomendations"].append(row["Fondo"])
            unique_values[row["Fondo"]] = row["Fondo"]

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)