# Meeting Room Reservation System

A Vue.js application for managing meeting room reservations with Supabase as the backend.

## Features

- View available meeting rooms and their equipment
- Make room reservations with customizable duration
- See upcoming meetings
- Real-time updates
- Responsive design with Tailwind CSS
- TypeScript support
- Unit testing with Vitest
- ESLint for code quality

## TODO

Upcoming features and improvements:

- [ ] Update meeting information
  - Edit meeting title and description
  - Modify meeting duration
  - Change meeting room
- [ ] Delete meetings
  - Cancel upcoming reservations
  - Implement confirmation dialog
  - Add cancellation notifications
- [ ] Improve room management
  - Add room availability calendar view
  - Implement room usage statistics
  - Add room maintenance schedule

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meeting-room-reservation
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Connect to your Supabase project
   - The migration files in `supabase/migrations` will be automatically applied

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run coverage` - Generate test coverage report
- `npm run lint` - Run ESLint and fix issues

## Building for Production

To create a production build:

```bash
npm run build
```

## Testing

Run the test suite:

```bash
npm run test
```

Generate coverage report:

```bash
npm run coverage
```

## Linting

The project uses ESLint with TypeScript and Vue.js support. To run the linter:

```bash
npm run lint
```

## Project Structure

```
├── src/
│   ├── components/      # Vue components
│   │   ├── ReservationForm.vue
│   │   ├── RoomList.vue
│   │   └── UpcomingMeetings.vue
│   ├── stores/         # Pinia stores
│   │   └── roomStore.ts
│   ├── services/       # API services
│   │   └── supabase.ts
│   ├── types/          # TypeScript types
│   │   └── room.ts
│   └── lib/           # Utilities and configurations
│       └── supabaseClient.ts
├── supabase/
│   └── migrations/    # Database migrations
└── public/           # Static assets
```

## Tech Stack

- Vue 3 - Progressive JavaScript framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Pinia - Vue Store library
- Supabase - Backend as a Service
- Vite - Build tool and dev server
- Vitest - Unit testing framework
- ESLint - Code quality and style

## Database Schema

### Rooms Table
- `id`: UUID (Primary Key)
- `name`: Text
- `description`: Text (Optional)
- `capacity`: Integer
- `equipements`: JSONB
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Reservations Table
- `id`: UUID (Primary Key)
- `room_id`: UUID (Foreign Key)
- `start_time`: Timestamp
- `end_time`: Timestamp
- `title`: Text
- `description`: Text (Optional)
- `created_at`: Timestamp

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.