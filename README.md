# Instagram Unfollower Tracker

Instagram Unfollower Tracker is a user-friendly, responsive web application that helps Instagram users identify who isn't following them back. Users can upload a ZIP file containing their Instagram followers and following data, and the tool processes the file to display a list of users who follow the account but are not followed back.

## Features

- Responsive Design: Fully responsive layout, ensuring smooth use on both desktop and mobile devices.
- File Upload: Users can upload a ZIP file containing Instagram followers and following data.
- Real-Time Processing: The tool processes the data in real time and shows the list of unfollowers.
- Clean and Modern UI: A simple, attractive design with easy navigation and clear feedback.
- Error Handling: Friendly messages in case of errors or missing data.

## Technologies Used

- Frontend:
  - ReactJS: For building the user interface and managing state.
  - CSS: For styling the application with a modern, responsive layout.
  - JSZip: To handle ZIP file extraction.
  - jsPDF: To generate downloadable PDF reports.

- Backend (Optional):
  - None (Purely client-side application)

## How to Use

1. Visit the website.
2. Upload a ZIP file containing the Instagram followers and following data. The file should contain:
   - followers_1.json: A JSON file with the list of followers.
   - following.json: A JSON file with the list of following.
3. Wait for the tool to process the data.
4. The non-followers will be displayed along with a button to download the results as a PDF.


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or inquiries, feel free to reach out to **kunjpatel4748@gmail.com** or open an issue in the GitHub repository.
