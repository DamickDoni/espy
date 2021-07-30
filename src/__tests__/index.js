/**
* @jest-environment jsdom
*/

import {
    EPSY,
    EVENTS,
    WATCHER,
    Epsy,
} from '../index';

const namespace = 'foobar';

let windowSpy;
let epsy;
const mock = 'foo';
const mockEvents = ['foo', 'bar'];
const mockedFn = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    epsy = new Epsy(namespace);
    windowSpy = jest.spyOn(global, 'window', 'get');

});
afterEach(() => {
    window[EPSY][WATCHER][namespace] = [];
    window[EPSY][EVENTS][namespace] = [];
    windowSpy.mockRestore();
});
describe('epsy', () => {
    it('should add epsy to global window', () => {
        const epsyObject = window[EPSY];
        expect(epsyObject).toBeDefined();
    });
    it('should add empty epsy objects to global window', () => {
        const epsyObject = window[EPSY];
        expect(Object.keys(window[EPSY])).toEqual([WATCHER, EVENTS]);
        expect(epsyObject[EVENTS][namespace]).toHaveLength(0)
    });
    it('should pub a event', () => {
        const epsEvent = window[EPSY][EVENTS][namespace]
        epsy.pub(mock);
        expect(epsEvent[0]).toEqual(mock)
    });
    it('should sub add a watcher', () => {
        epsy.sub(mockedFn);
        const epsyObj = window[EPSY][WATCHER][namespace];
        expect(epsyObj).toHaveLength(1);
    });
    it('should sub trigger a event', () => {
        const epsyEvent = window[EPSY][EVENTS][namespace]
        epsy.sub(mockedFn);
        epsy.pub(mock);
        expect(epsyEvent).toEqual([mock]);
    });
    it('should sub and return all events', () => {
        epsy.sub(mockedFn, false);
        mockEvents.map(e => epsy.pub(e));
        expect(mockedFn).toHaveBeenCalledWith(mockEvents);
    });
    it('should sub and return last event', () => {
        mockEvents.map(e => epsy.pub(e));
        epsy.sub(mockedFn, true);
        expect(mockedFn).toHaveBeenCalledWith(mockEvents[1]);
    });
    it('should cancel epsy sub', () => {
        epsy.cancel(mockedFn);
        const epsyWatcher = window[EPSY][WATCHER][namespace]
        expect(epsyWatcher).toHaveLength(0);
    });
});
