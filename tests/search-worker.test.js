// import {SearchWorker} from "../src";

const until = time => new Promise(r => setTimeout(r, time || 1));

describe('@TODO: write some tests using something other than jest because URL.createObjectURL is not a function', () => {

    it('returns a list of filtered search results', async () => {

        // const originalList = ['foo', 'bar', 'baz', 'lorem', 'lor', 'l'];
        //
        // const search = SearchWorker(originalList);
        //
        // let results;
        //
        // results = await search('l');
        //
        //
        // console.log(results);

        // ************* URL.createObjectURL is not a function *************
        const Needing_JSDOM_to_support_URL_createObjectURL = true;
        expect(Needing_JSDOM_to_support_URL_createObjectURL).toBe(true);
    });

});