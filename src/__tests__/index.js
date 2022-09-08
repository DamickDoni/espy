/**
* @jest-environment jsdom
*/
const ESPY = "__ESPY__";
const EVENTS = "__EVENTS__";
const WATCHER = "__WATCHER__";

import {
    Espy,
} from '../index';

const namespace = 'foobar';

let windowSpy;
let espy;
const mock = 'foo';
const mockEvents = ['foo', 'bar'];
const mockedFn = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    espy = new Espy(namespace);
    windowSpy = jest.spyOn(global, 'window', 'get');

});
afterEach(() => {
    window[ESPY][WATCHER][namespace] = [];
    window[ESPY][EVENTS][namespace] = [];
    windowSpy.mockRestore();
});
describe('espy', () => {
    it('should add espy to global window', () => {
        const espyObject = window[ESPY];
        expect(espyObject).toBeDefined();
    });
    it('should add empty espy objects to global window', () => {
        const espyObject = window[ESPY];
        expect(Object.keys(window[ESPY])).toEqual([WATCHER, EVENTS]);
        expect(espyObject[EVENTS][namespace]).toHaveLength(0)
    });
    it('should pub a event', () => {
        const espyEvent = window[ESPY][EVENTS][namespace]
        espy.pub(mock);
        expect(espyEvent[0]).toEqual(mock)
    });
    it('should sub add a watcher', () => {
        espy.sub(mockedFn);
        const espyObj = window[ESPY][WATCHER][namespace];
        expect(espyObj).toHaveLength(1);
    });
    it('should sub trigger a event', () => {
        const espyEvent = window[ESPY][EVENTS][namespace]
        espy.sub(mockedFn);
        espy.pub(mock);
        expect(espyEvent).toEqual([mock]);
    });
    it('should sub and return all events', () => {
        espy.sub(mockedFn, false);
        mockEvents.map(e => espy.pub(e));
        expect(mockedFn).toHaveBeenCalledWith(mockEvents);
    });
    it('should sub and return last event', () => {
        mockEvents.map(e => espy.pub(e));
        espy.sub(mockedFn, true);
        expect(mockedFn).toHaveBeenCalledWith(mockEvents[1]);
    });
    it('should cancel espy sub', () => {
        espy.cancel(mockedFn);
        const espyWatcher = window[ESPY][WATCHER][namespace]
        expect(espyWatcher).toHaveLength(0);
    });
});
