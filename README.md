# Contentful Secret Field App

This project provides a custom field app for Contentful to handle secret values.

## Installation

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```

## Usage

• Deploy or host this app in your Contentful environment.
• Configure it as a field extension where you need a random secret value.

## Creating a Contentful App

Follow these steps to create and configure your Contentful app from the terminal:

1. **Create a new app definition**:
   ```bash
   npm run create-app-definition
   ```

2. **Build the app**:
   ```bash
   npm run build
   ```

3. **Upload the app**:
   ```bash
   npm run upload
   ```

4. **Use the app in your content model**:
   - Edit your content model and add a new field.
   - Set the field type to **Short Text**.
   - Under **Appearance**, select your custom app.
   - Ensure the field is set to **required**.
   - Set the **limit character count** options (min and max) to the same number as the **secret length** option of the app.

## Contributing

Feel free to open issues or submit pull requests!

## License

MIT License
