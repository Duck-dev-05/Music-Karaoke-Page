export default function Navbar() {
  return (
    <header className="w-full p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Karaoke Music</h1>
      <nav>
        <ul className="flex gap-4">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Playlists</a></li>
          <li><a href="#" className="hover:underline">Profile</a></li>
        </ul>
      </nav>
    </header>
  );
} 