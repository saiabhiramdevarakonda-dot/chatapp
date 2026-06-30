let faqVectors = [];

export function setFaqVectors(vectors) {
    faqVectors = vectors;
}

export function getFaqVectors() {
    return faqVectors;
}

export function isCacheReady() {
    return faqVectors.length > 0;
}