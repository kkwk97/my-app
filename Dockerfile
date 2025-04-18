# Step 1: Use an official Node.js runtime as a parent image
FROM node:16 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies inside the container
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use a lightweight web server to serve the React app
FROM nginx:alpine

# Step 8: Copy the built app from the previous step to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to access the app
EXPOSE 80

# Step 10: Start the Nginx server to serve the React app
CMD ["nginx", "-g", "daemon off;"]
