export default function addEventListener(node, eventName, handler, options) {
    node.addEventListener(eventName, handler, options);
    return {
        removeEventListener: () => {
            node.removeEventListener(eventName, handler, options);
        }
    };
}
