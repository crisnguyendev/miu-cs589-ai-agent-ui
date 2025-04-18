import { useState } from 'react';
import { CORE_CONCEPTS } from './data';
import CoreConcept from './components/CoreConcept';
import Header from './components/Header/Header';
import TabButton from './components/TabButton';
import { EXAMPLES } from './data';
import ChatComponent from "./components/ChatComponent";
function App() {

  const [ selectedTopic, setSelectedTopic ] = useState('');

  function handleSelect(selectedButton) {
      setSelectedTopic(selectedButton);
  }

  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Main concepts:</h2>
          <ul>
            {
              CORE_CONCEPTS.map((item) => <CoreConcept key={item.title} {...item} />)
            }
          </ul>
        </section>
        <section id="examples">
          <h2>More topics</h2>
          <menu>
          <TabButton isSelected={selectedTopic === 'sanskrit'} onSelect={() => handleSelect('sanskrit')}>Sanskrit</TabButton>
          <TabButton isSelected={selectedTopic === 'jyotish'} onSelect={() => handleSelect('jyotish')}>Jyotish</TabButton>
          <TabButton isSelected={selectedTopic === 'yagya'} onSelect={() => handleSelect('yagya')}>Yagya</TabButton>
          <TabButton isSelected={selectedTopic === 'sacredGeometry'} onSelect={() => handleSelect('sacredGeometry')}>Sacred Geometry</TabButton>
          <TabButton isSelected={selectedTopic === 'prana'} onSelect={() => handleSelect('prana')}>Dharma and Karma</TabButton>
          </menu>          
          {!selectedTopic && <p>Please select a topic</p>}
          {selectedTopic && (
            <div id='tab-content'>
              <h3>{EXAMPLES[selectedTopic].title}</h3>
              <p>{EXAMPLES[selectedTopic].description}</p>
            </div>)}
        </section>
        <section id="core-concepts">
          <ChatComponent />        
        </section>
      </main>     
    </div>
  );
}

export default App;