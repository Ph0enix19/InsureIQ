import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

def train():
    data = [
        # Motor
        ("My vehicle was involved in a collision on the highway.", "Motor"),
        ("Someone scratched my parked car, the bumper is damaged.", "Motor"),
        ("I got into an accident at the intersection. The windshield is shattered.", "Motor"),
        ("Another driver rear-ended me and fled the scene. Need repair estimate.", "Motor"),
        ("My motorcycle skidded on a wet road, causing severe damage.", "Motor"),
        ("A tree branch fell on my car during the storm. Roof is dented.", "Motor"),
        ("The other driver ran a red light and hit my passenger side.", "Motor"),
        ("I hit a pothole and my tire burst, rim is also bent.", "Motor"),
        ("There was a minor fender bender in the parking lot.", "Motor"),
        ("The truck sideswiped my vehicle on the interstate.", "Motor"),
        # Travel
        ("My flight was cancelled due to bad weather and I lost my hotel booking.", "Travel"),
        ("My baggage was delayed for 3 days on my trip to Europe.", "Travel"),
        ("My passport was stolen while sightseeing in the city.", "Travel"),
        ("I had to cut my trip short because of a sudden illness in the family.", "Travel"),
        ("The airline permanently lost my luggage and all my belongings.", "Travel"),
        ("I missed my connecting flight because of a delay on the first leg.", "Travel"),
        ("I was pickpocketed at the train station and lost my wallet.", "Travel"),
        ("The cruise was cancelled at the last minute.", "Travel"),
        ("My camera broke when I fell during a hiking tour.", "Travel"),
        ("The tour operator went bankrupt before my trip started.", "Travel"),
        # Medical
        ("I was admitted to the hospital with a severe fever and infection.", "Medical"),
        ("I broke my arm playing sports and needed emergency surgery.", "Medical"),
        ("I had a scheduled dental procedure for wisdom teeth extraction.", "Medical"),
        ("Prescription medication for chronic illness.", "Medical"),
        ("I received an MRI scan for my persistent back pain.", "Medical"),
        ("Physiotherapy sessions following a knee injury.", "Medical"),
        ("I visited the emergency room for food poisoning.", "Medical"),
        ("Routine blood test and checkup consultation.", "Medical"),
        ("Ambulance transport after fainting at work.", "Medical"),
        ("Laser eye surgery for vision correction.", "Medical"),
        # Home
        ("A pipe burst in the kitchen and flooded the entire ground floor.", "Home"),
        ("Burglars broke in through the back window and stole electronics.", "Home"),
        ("A heavy storm tore off sections of the roof, causing water damage.", "Home"),
        ("There was a grease fire in the kitchen damaging the cabinets.", "Home"),
        ("My laptop was stolen from my home office.", "Home"),
        ("The basement flooded after heavy rainfall.", "Home"),
        ("A power surge destroyed my television and computer.", "Home"),
        ("Vandals spray-painted the front wall of my house.", "Home"),
        ("The geyser leaked and damaged the ceiling.", "Home"),
        ("A falling tree damaged the storage shed in my backyard.", "Home"),
    ]

    claims, labels = zip(*data)

    pipeline = make_pipeline(
        TfidfVectorizer(stop_words='english'),
        MultinomialNB()
    )

    pipeline.fit(claims, labels)
    
    model_path = os.path.join(os.path.dirname(__file__), 'claim_classifier.pkl')
    joblib.dump(pipeline, model_path)
    print(f"Model successfully trained and saved to {model_path}!")

if __name__ == "__main__":
    train()
