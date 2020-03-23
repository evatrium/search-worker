import {h, Component, render} from 'preact';
import {useState, useCallback} from "preact/hooks";
import VirtualList from 'preact-virtual-list';

import {SearchWorker} from "../../src";
import './styles.css'

let loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. usto eget magna fermentum iaculis eu non. Cursus eget nunc scelerisque viverra. Ultricies integer quis auctor elit sed vulputate mi sit. Elit duis tristique sollicitudin nibh sit. Tortor posuere ac ut consequat semper viverra. Aliquam sem fringilla ut morbi tincidunt augue interdum. Vivamus arcu felis bibendum ut tristique et egestas quis. Massa vitae tortor condimentum lacinia quis vel eros donec. Mattis molestie a iaculis at erat pellentesque. Viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Quis imperdiet massa tincidunt nunc pulvinar sapien et. Sed faucibus turpis in eu mi bibendum neque. Id volutpat lacus laoreet non curabitur gravida arcu. Euismod quis viverra nibh cras pulvinar mattis nunc. Felis eget velit aliquet sagittis id consectetur purus. Feugiat sed lectus vestibulum mattis ullamcorper. In fermentum et sollicitudin ac orci phasellus. Massa tincidunt nunc pulvinar sapien et. Egestas erat imperdiet sed euismod nisi porta. Facilisis leo vel fringilla est ullamcorper eget nulla. At quis risus sed vulputate odio ut enim. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Pellentesque diam volutpat commodo sed egestas egestas fringilla. Sapien eget mi proin sed libero enim sed. At quis risus sed vulputate odio. Adipiscing elit pellentesque habitant morbi tristique senectus et. Senectus et netus et malesuada. Elementum eu facilisis sed odio morbi. Neque gravida in fermentum et sollicitudin ac orci. Mauris commodo quis imperdiet massa. Non odio euismod lacinia at quis risus sed vulputate odio. Aliquet nec ullamcorper sit amet risus. Vivamus arcu felis bibendum ut tristique et egestas quis ipsum. Tempor orci dapibus ultrices in iaculis. Elementum integer enim neque volutpat ac tincidunt vitae. Elit eget gravida cum sociis natoque penatibus et. Tristique magna sit amet purus gravida quis blandit. Erat velit scelerisque in dictum. Quam nulla porttitor massa id neque aliquam vestibulum morbi. Tincidunt id aliquet risus feugiat in ante metus dictum at. Orci ac auctor augue mauris augue neque gravida in. Gravida neque convallis a cras semper auctor neque vitae. Eros donec ac odio tempor. Congue nisi vitae suscipit tellus mauris. In nulla posuere sollicitudin aliquam ultrices sagittis orci a. Porttitor rhoncus dolor purus non enim praesent elementum. Tristique nulla aliquet enim tortor at auctor. Ac tincidunt vitae semper quis lectus nulla. Aliquam ut porttitor leo a. Vel turpis nunc eget lorem. Risus nec feugiat in fermentum posuere urna nec. Ut tristique et egestas quis ipsum suspendisse. Pellentesque elit eget gravida cum sociis natoque penatibus et. Sit amet purus gravida quis blandit turpis cursus in hac. Nibh sed pulvinar proin gravida hendrerit lectus. Volutpat blandit aliquam etiam erat velit scelerisque. Massa enim nec dui nunc mattis enim ut tellus. Magnis dis parturient montes nascetur ridiculus. Bibendum at varius vel pharetra vel turpis nunc eget lorem. Dignissim suspendisse in est ante in nibh mauris cursus. Duis tristique sollicitudin nibh sit. Tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra. Justo donec enim diam vulputate ut. Sit amet luctus venenatis lectus magna. Pharetra massa massa ultricies mi quis.`;


loremIpsum = loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum +
    loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum +
    loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum;


let id = 0;
let originalList = [];
const addItem = (name, name2) => originalList.push(({name, name2, id: id++}));
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


const wordsArray = loremIpsum.split(' ');
wordsArray.reverse();
const reversed = [...wordsArray];
wordsArray.reverse();

wordsArray.map((word, index) => {
    addItem(word, reversed[index])
});


let fuzzyLevel = 3;

let searchWorker = SearchWorker(originalList, {keys: ['name', 'name2', 'foobar'], fuzzy: fuzzyLevel});

const useSearch = (originalList) => {
    const [list, setList] = useState(originalList);
    const [searchValue, setValue] = useState('');
    const [fuzzy, setFuzzy] = useState(fuzzyLevel);

    let updateSearch = useCallback((value) => {
        setValue(value);
        searchWorker(value).then(updatedList => {
            setList(updatedList);
        })
    }, []);

    let updateFuzzyLevel = useCallback((level, searchValue) => {
        setFuzzy(level);
        searchWorker = SearchWorker(originalList, {keys: ['name', 'name2'], fuzzy: level});
        updateSearch(searchValue);
    }, []);

    return {list, updateSearch, searchValue, fuzzy, updateFuzzyLevel}
};


class List extends Component {
    rowHeight = 30;

    renderRow(item) {
        return (
            <div key={item.id} className={'row'} style={{display: 'flex'}}>
                <div style={{width: 300}}>
                    <b>name: </b>{' '} {item.name}
                </div>
                {item.name2 && <div style={{marginLeft: 20, width: 300}}>
                    <b>name2: </b>{' '} {item.name2}
                </div>}
            </div>
        )
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

    const {list, updateSearch, searchValue, updateFuzzyLevel, fuzzy} = useSearch(originalList);

    const update = useCallback(({target: {value}}) => updateSearch(value), []);

    const LevelBtn = ({level}) => (
        <button style={{color: fuzzy === level ? 'red' : 'black'}} onClick={() => updateFuzzyLevel(level, searchValue)}>
            {level}
        </button>
    );

    return (
        <div>
            <h1>App</h1>
            <h3>showing ({list.length}) item{list.length !== 1 ? 's' : ''}</h3>
            <h3>Fuzzy Level: {fuzzy}</h3>

            Fuzzy levels:
            <br/>
            <LevelBtn level={0}/>
            <LevelBtn level={1}/>
            <LevelBtn level={2}/>
            <LevelBtn level={3}/>
            <br/>

            <input autoFocus={true} value={searchValue} onInput={update}/>

            <List data={list}/>

        </div>
    )
};

render(<App/>, document.body);
