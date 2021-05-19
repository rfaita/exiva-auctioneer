const skillsWords = ['axe', 'sword', 'club', 'fist', 'distance', 'magic', 'fishing'];
const intWords = ['auction.value', 'level'];
const comparatorsWords = ['greater', '>', '>=', '=>', 'lower', '<', '<=', '=<', 'equals', '=', '=='];
const genericWords = ['server', 'world', 'auction.status'];

const comparatorsWordOp = {
    'greater': '$gte',
    '>': '$gte',
    '>=': '$gte',
    '=>': '$gte',
    'lower': '$lte',
    '<': '$lte',
    '<=': '$lte',
    '=<': '$lte',
    'equals': ':',
    '=': ':',
    '==': ':'
};

function extractCondition(field, op, value) {
    const newOp = comparatorsWordOp[op];
    const cond = {};

    const skills = skillsWords.indexOf(field) > -1 ? 'skills.' : '';

    if (newOp === '$gte' || newOp === '$lte') {
        cond[`${skills}${field}`] = {};
        cond[`${skills}${field}`][newOp] = parseInt(value);
    } else {
        cond[`${skills}${field}`] = parseInt(value);
    }
    return cond;
}

const parseQuery = function (query) {
    console.log(query);

    query = query.replace(/(>=|=>|<=|=<|=+|>|<)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    query = query.replaceAll('world', 'server');

    query += query.indexOf('level') <= -1 ? ' level 0' : '';

    if (query.indexOf('value') <= -1) {
        query += ' auction.value 0';
    } else {
        query = query.replaceAll('value', 'auction.value');
    }

    if (query.indexOf('status') <= -1) {
        query += ' auction.status ongoing';
    } else {
        query = query.replaceAll('status', 'auction.status');
    }



    const splited = query.toLowerCase().split(' ');

    let ret = { $and: [] };

    for (let index = 0; index < splited.length; index++) {
        const field = splited[index];
        console.log(`field: ${field}`);
        if (skillsWords.indexOf(field) > -1 || intWords.indexOf(field) > -1) {
            const next = splited[++index];
            console.log(`next: ${next}`);
            if (comparatorsWords.indexOf(next) > -1) {
                const op = next;
                const value = splited[++index];
                console.log(`value: ${value}`);
                if (isNaN(parseInt(value))) {
                    throw new Error('invalid query');
                } else {
                    ret.$and.push(extractCondition(field, op, parseInt(value)));
                }
            } else if (isNaN(parseInt(next))) {
                throw new Error('invalid query');
            } else {
                ret.$and.push(extractCondition(field, '>', parseInt(next)));
            }
        } else if (genericWords.indexOf(field) > -1) {
            let next = splited[++index];
            

            const and = {};            
            if (field === 'server') {
                next = next.charAt(0).toUpperCase() + next.slice(1).toLowerCase();
            }
            console.log(`next: ${next}`);
            and[field] = next;

            ret.$and.push(and);

        } else {
            throw new Error('invalid query');
        }
    }

    return ret;

}

export default parseQuery;