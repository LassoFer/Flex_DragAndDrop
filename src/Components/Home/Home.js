import { useEffect, useRef, useState } from 'react';
import DragAndDrop from '../DragAndDrop';
import './Home.css';

export default function Home(props) {
  const [data, setData] = useState([]);
  const contRef = useRef();

  useEffect(() => {
    let data_ = [];
    for (let i = 0; i < 100; i++) {
      let red = Math.floor(Math.random() * 200) + 100;
      let green = Math.floor(Math.random() * 200) + 100;
      let blue = Math.floor(Math.random() * 200) + 100;

      let backgroundColor = `rgb(${red}, ${green}, ${blue})`;
      data_.push({
        _id: i,
        name: i,
        renderMethod: (
          <div style={{ backgroundColor: backgroundColor }} className="element">
            <h1>{i}</h1>
          </div>
        ),
      });
    }
    setData([...data_]);
  }, []);

  return (
    <div ref={contRef} className="data">
      <DragAndDrop
        duration={200}
        list_={data}
        contRef={contRef}
        elementclassName="element-container"
        containerclassName="data"
      />
    </div>
  );
}
