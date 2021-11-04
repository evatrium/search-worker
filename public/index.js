import { h, Component, render } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import VirtualList from './preact-virtual-list';

import { SearchWorker } from '../src';
import './styles.css';
import { data } from './data';


let id = data.length;

const addItem = (first_name) => data.push(({
  'id': id++,
  first_name,
  'last_name': 'Jones',
  'age': id,
  'city': 'Flavieside',
  'ip': `63.66.189.${id}`
}));

addItem('123');
addItem('SIMPLE');
addItem('Simple');
addItem('simple');
addItem('Simple Fuzzy Search 123');
addItem('simple fuzzy search 123');
addItem('Simple Fuzzy');
addItem('Simple 123');
addItem('simplefuzzysearch123');
addItem('simple-fuzzy-search-123');
addItem('simple_fuzzy_search_123');
addItem('simple_fuzzy_search_123');
addItem('LOREM IPSUM DOLOR SIT AMET');
addItem('Lorem Ipsum Dolor Sit Amet');
addItem('lorem ipsum dolor sit amet');
addItem('lorem-ipsum-dolor-sit-amet');
addItem('lorem_ipsum_dolor_sit_amet');

[...Array(10000)].forEach((_, i) => {
  addItem('rando-' + (data.length + i));
});


let searchWorker = SearchWorker(data, {
  keys: [
    'first_name',
    'last_name',
    'age',
    'city',
    'ip'
  ]
});

const useSearch = (originalList) => {
  const [list, setList] = useState(originalList);
  const [searchValue, setValue] = useState('');

  let updateSearch = useCallback((value) => {
    setValue(value);
    searchWorker(value).then(updatedList => {
      setList(updatedList);
    });
  }, []);

  return { list, updateSearch, searchValue };
};


class List extends Component {
  rowHeight = 30;

  renderRow(item) {
    const keys = Object.keys(item);
    return (
      <div key={item.id} className={'row'}>
        {keys.map((it, i) => (
          it === 'id' ? null : (
            <div style={{
              overflow: 'hidden',
              width: `${(100 / (keys.length - 1)).toFixed(3)}%`
            }} key={i}>
              {item[it]}
            </div>
          )
        ))}
      </div>
    );
  }

  render() {
    return (
      <VirtualList
        sync
        class="list"
        data={this.props.data}
        rowHeight={this.rowHeight}
        renderRow={this.renderRow}
      />
    );
  }
}

const App = () => {

  const { list, updateSearch, searchValue } = useSearch(data);

  const update = useCallback(({ target: { value } }) => updateSearch(value), []);

  return (
    <div>
      <h1>App</h1>
      <h3>showing ({list.length}) item{list.length !== 1 ? 's' : ''}</h3>

      <input autoFocus={true} value={searchValue} onInput={update}/>

      <List data={list}/>

    </div>
  );
};

render(<App/>, document.body);
