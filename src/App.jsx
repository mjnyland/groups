import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import OptionOne from "./OptionOne";
import OptionTwo from "./OptionTwo";

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation(); // Get the current route location

  return (
    <div className="min-h-screen bg-gray-900 flex gap-[16px] justify-center p-6 w-full">
      <div className="flex flex-col gap-[16px] w-full">
        <div className="flex gap-[8px]">
          <Link
            to="/option-one"
            className={`text-white text-lg px-4 py-2 rounded-lg ${
              location.pathname === "/option-one"
                ? "bg-gray-100"
                : "bg-gray-800"
            }`}
          >
            People in many groups
          </Link>
          <Link
            to="/option-two"
            className={`text-white text-lg px-4 py-2 rounded-lg ${
              location.pathname === "/option-two"
                ? "bg-gray-100"
                : "bg-gray-800"
            }`}
          >
            People in one group
          </Link>
        </div>

        <Routes>
          <Route path="/option-one" element={<OptionOne />} />
          <Route path="/option-two" element={<OptionTwo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
