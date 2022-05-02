const DEFAULT_MEMBERS = (id) => {
    return [
    {
        id: id+1,
        name: 'DaTissueBox',
        rank: 5,
        roles: ['jg', 'adc']
    },
    {
        id: id+2,
        name: 'Pistol95',
        rank: 3,
        roles: ['fill']
    },
    {
        id: id+3,
        name: 'NeoMorph',
        rank: 3,
        roles: ['mid', 'top']
    },
    {
        id: id+4,
        name: 'Rank 1',
        rank: 3,
        roles: ['mid', 'adc']
    },
    {
        id: id+5,
        name: 'Hermonie',
        rank: 2,
        roles: ['supp', 'mid']
    }];
}

const api = {
    getTeam: (id) => {
        return {
            id,
            name: 'Boxes',
            members: DEFAULT_MEMBERS(id)
        }
    },

    getPool: (id) => {
        return {
            id,
            name: 'Pool created today',
            members: DEFAULT_MEMBERS(id)
        }
    },

    search: (term) => {
        return Promise.resolve(DEFAULT_MEMBERS(0).concat(DEFAULT_MEMBERS(5)));
    }
}

export default api;
