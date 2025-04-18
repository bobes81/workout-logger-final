import os
import json
import sys
import gspread
from google.oauth2.service_account import Credentials
from colorama import Fore, init
from datetime import datetime

# Initialize colorama
init(autoreset=True)

# Google Sheets setup
SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
]

try:
    creds_dict = json.loads(os.environ["CREDS_JSON"])
    CREDS = Credentials.from_service_account_info(creds_dict)
    SCOPED_CREDS = CREDS.with_scopes(SCOPE)
    GSPREAD_CLIENT = gspread.authorize(SCOPED_CREDS)
    SHEET = GSPREAD_CLIENT.open_by_key("1sUgs6mm_g2wbyyLuSQjLvFOVHe_XpYVGGucRCXgzZWc")
    worksheet = SHEET.worksheet("Sheet1")
except Exception as e:
    print(Fore.RED + f"\nError connecting to Google Sheet: {e}")
    sys.exit(1)

# Safety questions
def run_safety_check():
    print(Fore.YELLOW + "\n***************************************")
    print("WELCOME TO OUR ONLINE WORKOUT LOGGER")
    print("***************************************")
    print("\nBefore we get started, please answer the following medical questions:\n")
    questions = [
        "Do you have a heart condition?",
        "Do you feel pain in your chest during physical activity?",
        "Are you currently pregnant?",
        "Do you have any joint or bone problems?",
        "Do you experience dizziness or loss of balance?"
    ]
    for question in questions:
        while True:
            answer = input(f"{question} (Yes/No): ").strip().lower()
            if answer in ["yes", "no"]:
                break
            else:
                print(Fore.RED + "Please answer Yes or No.")

# Log workout
def add_workout():
    print(Fore.CYAN + "\nLet's log your workout!")
    exercise = input("Type of exercise: ").strip().title()

    while True:
        try:
            duration = int(input("Duration in minutes: ").strip())
            break
        except ValueError:
            print(Fore.RED + "Please enter a valid number.")

    while True:
        intensity = input("Intensity (Low / Medium / High): ").strip().capitalize()
        if intensity in ["Low", "Medium", "High"]:
            break
        else:
            print(Fore.RED + "Please enter: Low, Medium, or High.")

    date = datetime.now().strftime("%d/%m/%Y")
    try:
        worksheet.append_row([date, exercise, duration, intensity])
        print(Fore.GREEN + "\n✅ Workout logged successfully!\n")
    except Exception as e:
        print(Fore.RED + f"Failed to log workout: {e}")

# View workouts
def view_workouts():
    print(Fore.CYAN + "\nYour workout history:")
    try:
        data = worksheet.get_all_values()
        if len(data) <= 1:
            print("No workouts logged yet.")
            return
        for row in data[1:]:
            print(f"Date: {row[0]} | Exercise: {row[1]} | Duration: {row[2]} mins | Intensity: {row[3]}")
    except Exception as e:
        print(Fore.RED + f"Error reading from sheet: {e}")

# Main menu
def main():
    print(Fore.YELLOW + "\nWelcome to the Workout Logger CLI App! 💪")
    run_safety_check()

    while True:
        print("\nWhat would you like to do?")
        print("1. Add a new workout")
        print("2. View workout history")
        print("3. Exit")

        choice = input("Enter your choice (1/2/3): ").strip()

        if choice == "1":
            add_workout()
        elif choice == "2":
            view_workouts()
        elif choice == "3":
            print(Fore.MAGENTA + "Goodbye! Stay strong! 💙")
            break
        else:
            print(Fore.RED + "Invalid input. Please choose 1, 2, or 3.")

if __name__ == "__main__":
    main()

