import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
from preprocess import clean_text

df = pd.read_csv("../data/dataset.csv")

df["prompt"] = df["prompt"].apply(clean_text)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["prompt"])

model = LogisticRegression()
model.fit(X, df["label"])

pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model trained and saved!")
