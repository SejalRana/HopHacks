from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import pandas as pd
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

import pandas as pd
import re

def extract_segments(df):
    # Identify the first column
    first_column = df.columns[0]
    
    def extract_class_letters(call_number):
        return re.match(r"^[A-Za-z]+", call_number).group(0) if re.match(r"^[A-Za-z]+", call_number) else ""

    def extract_class_number(call_number):
        match = re.search(r"[A-Za-z]+([0-9]+(?:\.[0-9]+)?)", call_number)
        if match:
            try:
                # Convert to float first, then to int if possible
                return int(float(match.group(1)))
            except ValueError:
                return None
        return None

    def extract_first_cutter(call_number):
        match = re.search(r"\s?\.([A-Za-z]+[0-9]*)", call_number)
        return match.group(1) if match else ""

    def extract_second_cutter(call_number):
        match = re.search(r"\s([A-Za-z0-9]+)\s?[0-9]{4}", call_number)
        return match.group(1) if match else ""

    def extract_year(call_number):
        match = re.search(r"\b(19\d{2}|20\d{2})\b", call_number)
        return int(match.group(1)) if match else None

    def extract_volume_number(call_number):
        match = re.search(r"(?:vol\.|no\.)\s?([0-9]+)", call_number)
        if match:
            try:
                return int(float(match.group(1)))
            except ValueError:
                return None
        return None

    def extract_copy_number(call_number):
        match = re.search(r"c\.\s?\[?([0-9]+)\]?", call_number)
        if match:
            try:
                return int(float(match.group(1)))
            except ValueError:
                return None
        return None

    # Apply extraction functions to DataFrame
    df['Class Letters'] = df[first_column].apply(extract_class_letters)
    df['Class Number'] = df[first_column].apply(extract_class_number)
    df['First Cutter'] = df[first_column].apply(extract_first_cutter)
    df['Second Cutter'] = df[first_column].apply(extract_second_cutter)
    df['Year'] = df[first_column].apply(extract_year)
    df['Volume Number'] = df[first_column].apply(extract_volume_number)
    df['Copy Number'] = df[first_column].apply(extract_copy_number)

    return df



@app.route('/')
def index():
    return render_template('index.html', sorted_file_url=None)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        # Sort the file and save it
        sorted_file_path = sort_file(file_path)
        sorted_file_url = '/static/sorted_file.xlsx'
        
        return render_template('index.html', sorted_file_url=sorted_file_url)

def sort_file(file_path):
    # Read the Excel file
    df = pd.read_excel(file_path)
    
    # Extract segments
    df = extract_segments(df)
    
    # Define the sorting columns
    sort_columns = [
        'Class Letters',
        'Class Number',
        'First Cutter',
        'Second Cutter',
        'Year',
        'Volume Number',
        'Copy Number'
    ]
    
    # Sort the DataFrame
    df_sorted = df.sort_values(by=sort_columns)
    
    # Save the sorted DataFrame to a new Excel file
    sorted_file_path = os.path.join('static', 'sorted_file.xlsx')
    df_sorted.to_excel(sorted_file_path, index=False)
    
    return sorted_file_path

@app.route('/static/<filename>')
def download_file(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)