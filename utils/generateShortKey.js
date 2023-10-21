import {customAlphabet} from 'nanoid'

const numbers = '0123456789';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = lowercase.toUpperCase()

const alphanumeric = numbers + lowercase + uppercase;

export function generateShortKey() {
    const nanoid = customAlphabet(alphanumeric, 14)
    
    return nanoid(7)
}

