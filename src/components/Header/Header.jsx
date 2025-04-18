import reactImage from '../../assets/main_concept.png';
import "./Header.css";

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

export default function Header() {
  return (
    <header>
      <img src={reactImage} alt="Stylized atom" />
      <h1>Vedic Science</h1>
      <p>
      Vedic Science is an ancient system of knowledge rooted in the Vedas, encompassing philosophy, spirituality, health, and cosmic principles to guide human life in harmony with nature and the universe.
      </p>
    </header>
  );
}