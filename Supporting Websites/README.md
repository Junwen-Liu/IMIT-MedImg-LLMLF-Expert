# Website Deployment Guide

We are in the process of preparing some dummy datasets in a MongoDB database for seamless integration with the websites. Once ready, we will upload them to this repository. Please stay updated on this page, and feel free to reach out via email at <ljwb5009@rjh.com.cn> for any urgent or special requests.

- Install [MongoDB and MongoDB Compass](https://www.mongodb.com/try/download/community).

- Install [Node.js and npm](https://nodejs.org/en/download/).

- Start MongoDB Compass.
  - Add a new connection, set to `localhost:27017`.

  - Create a database named `IMIT_Img_Reports_news` under the connection and create 6 collections under the database, named as the following:
    - `counters`
    - `prosp_records`
    - `real_imgs_reports`
    - `test_img_reports`
    - `test_img_reports_upt2s`
    - `users`

  - Create a database named `IMIT_Img_Reports_testing` under the connection and create 2 collections under the database, named as the following:
    - `real_imgs_reports`
    - `users`

  - Create a database named `IMIT_multi_center_reports` under the connection and create 4 collections under the database, named as the following:
    - `multicenter_reports`
    - `multicenter_reports_news`
    - `test_img_reports_upt2s`
    - `users`

  - *Note that the above databases are empty, but it should not interfere with the website deployment. Once our dummy datasets are ready, we will upload the json files, and you can upload them to the corresponding collections.*

- Run `npm install –legacy-peer-deps` in the frontend and backend folders of all 4 websites.

- Run `npm start` in all frontend and backend folders.

- Once you have launched these websites, you can check the user guides in the `screenshots` folder.
