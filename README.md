# React Google Flights Clone

A pixel-perfect clone of Google Flights built with React, TypeScript, and Material-UI. This project demonstrates modern web development practices and seamless API integration.

![Google Flights Clone Demo]()

## Features

- Pixel-perfect UI matching Google Flights' dark theme
- Real-time airport search with autocomplete
- Round-trip and one-way flight options
- Custom date picker with range selection
- Advanced passenger selection (Adults, Children, Infants)
- Multiple cabin class options
- Real-time flight data using Sky Scrapper API
- Fully responsive design
- Beautiful animations and transitions
- Accessibility considerations
- Type-safe implementation with TypeScript

## Live Demo

Check out the live demo: [React Google Flights Clone](your-demo-link-here)

## Tech Stack

- **Frontend Framework:** React 19.0.0
- **Type System:** TypeScript
- **UI Library:** Material-UI v6
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **API:** Sky Scrapper (via RapidAPI)
- **Styling:** Emotion (styled-components)
- **Development:** Create React App

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/react-google-flights.git
   cd react-google-flights
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit the .env file and add your RapidAPI key
   # Get your API key from: https://rapidapi.com/DataCrawler/api/sky-scrapper
   REACT_APP_RAPID_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`

## Environment Setup

This project uses environment variables to manage sensitive data. To set up your environment:

1. Sign up for a RapidAPI account at https://rapidapi.com
2. Subscribe to the Sky Scrapper API
3. Copy your RapidAPI key
4. Create a `.env` file in the root directory
5. Add your API key to the `.env` file:
   ```env
   REACT_APP_RAPID_API_KEY=your_api_key_here
   ```

**Note**: Never commit your `.env` file to version control. The `.env` file is listed in `.gitignore` to prevent accidental commits.

## Project Structure

```
src/
├── components/          # React components
│   ├── FlightSearch/   # Search functionality
│   └── FlightResults/  # Results display
├── services/           # API and other services
├── types/              # TypeScript definitions
├── utils/             # Helper functions
└── App.tsx            # Main application
```

## Key Components

### FlightSearch
- Custom airport search with autocomplete
- Date picker with range selection
- Passenger and cabin class selection
- Search parameters management

### FlightResults
- Dynamic flight card display
- Expandable flight details
- Airline information with logo
- Price and eco-friendly indicators

## Unique Features

1. **Dark Theme Implementation**
   - Custom Material-UI theme
   - Smooth color transitions
   - Consistent styling across components

2. **Advanced Search Options**
   - Multi-category passenger selection
   - Flexible date picking
   - Cabin class customization

3. **Performance Optimizations**
   - Lazy loading of components
   - Optimized API calls
   - Efficient state management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Notes

- Uses the latest React features including hooks and concurrent mode
- Implements best practices for TypeScript
- Follows Material Design principles
- Includes comprehensive error handling
- Features responsive design for all screen sizes

## Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)