const weaponAttributes = {
    claw: { primaryStat: "luk", primaryMulti: 3.6, secondary: ["str", "dex"], mastery: 0.6 },
}

/*
General Formula
MAX = (Primary Stat + Secondary Stat) * Weapon Attack / 100
MIN = (Primary Stat * 0.9 * Skill Mastery + Secondary Stat) * Weapon Attack / 100 
*/
const range = (char) => {
    const attributes = weaponAttributes[char.weapon.type]
    const basePrimaryStat = char.baseStats[attributes.primaryStat]
    const equipPrimary = getEquipPrimaryStats(char, attributes.primaryStat)
    const primaryStatSum = basePrimaryStat + Math.floor(basePrimaryStat * 0.1) + equipPrimary
    console.log(`luk: ${primaryStatSum}`)
    // breaks if all stats arent present at least as 0s
    const secondaryStatSum = getEquipSecondaryStats(char, attributes.secondary)//attributes.secondary.map(stat => char.baseStats[stat] + char.weapon.stats[stat]).reduce((acc, cur) => acc + cur, 0);
    const primary = primaryStatSum * attributes.primaryMulti;
    const secondary = secondaryStatSum
    const totalWatt = getTotalWatt(char)//char.weapon.att
    console.log(totalWatt)
    const maxRange = (primary + secondary) * (totalWatt) / 100
    const minRange = (primary * 0.9 * attributes.mastery + secondary) * totalWatt / 100
    return { minRange, maxRange }
}

const getEquipSecondaryStats = (char, secondaryStats) => {
    return secondaryStats.map(stat => {
        let total = char.baseStats[stat]
        total += Math.floor(total * 0.1)// mw calc
        Object.keys(char.equip).forEach(slot => {
            const eq = char.equip[slot]
            if (!isNaN(Number(eq.stats[stat]))) {
                total += eq.stats[stat];
            }
        })
        
        console.log(`${stat}: ${total}`)
        return total;
    }).reduce((acc, cur) => acc + cur, 0);
}

/*
Lucky Seven/Triple Throw (credit to HS.net / LazyBui for """""""recent""""""" verification):
MAX = (LUK * 5.0) * Weapon Attack / 100
MIN = (LUK * 2.5) * Weapon Attack / 100
Lucky Seven/Triple Throw/Drain/Shadow Meso/Normal Attack
Faster (2): 600ms (-210ms)
Faster (3): 660ms (-150ms)
Fast (4): 720ms (-90ms)
Fast (5): 750ms (-60ms)
Normal (6): 810ms
Shadow partner is 50% of the hit floored. tested in game
*/
const ttDamage = (char) => {
    const attributes = weaponAttributes[char.weapon.type]
    const primaryStatSum = char.baseStats[attributes.primaryStat] + char.weapon.stats[attributes.primaryStat]
    const totalWatt = getTotalWatt(char) //char.weapon.att
    const maxTT = (primaryStatSum * 5) * totalWatt / 100
    const minTT = (primaryStatSum * 2.5) * totalWatt / 100
    const avgTT = (maxTT + minTT) / 2 // 
    const skillPercentage = 1.5 // 150%
    const baseDamage = avgTT * skillPercentage
    const critMulti = 2 + 1.4 // base + SE
    const critDamage = baseDamage * critMulti
    const critChance = 0.50 + 0.15 // base + SE
    const averageDamage = baseDamage * (1 - critChance) + critDamage * critChance
    const maxHit = maxTT * skillPercentage * critMulti
    const skillTime = 0.6
    // 3 hits + 3*0.5 hits from sp
    const averageDps = (3 + 3 * 0.5) * averageDamage / skillTime
    return { averageDps, averageDamage, maxHit }
    //TODO shadow partner, just 50% of the hit?
}

const getTotalWatt = char => {
    let total = 0;
    Object.keys(char.equip).forEach(key => {
        if (!isNaN(Number(char.equip[key]?.att))) {
            total += char.equip[key]?.att
        }
    })
    return total;
}

const getEquipPrimaryStats = (char, primaryStat) => {
    let total = 0;
    Object.keys(char.equip).forEach(key => {
        if (!isNaN(Number(char.equip[key]?.stats[primaryStat]))) {
            total += char.equip[key]?.stats[primaryStat]
        }
    })
    return total;
}



const tomp = {
    baseStats: {
        str: 4,
        dex: 25,
        int: 4,
        luk: 997,
    },
    equip: {
        helmet: {
            name: "auf",
            stats: {
                str: 84,
                dex: 87,
                int: 84,
                luk: 86
            }
        },
        medal: {
            name: "leg thief",
            stats: {
                str: 0,
                dex: 0,
                luk: 0,
            },
            att: 3
        },
        ear: {
            name: "ifia",
            stats: {
                str: 0,
                dex: 0,
                luk: 17,
            }
        },
        face: {
            name: "nose",
            stats: {
                str: 1,
                dex: 0,
                luk: 7,
            }
        },
        eye: {
            name: "toad",
            stats: {
                str: 3,
                dex: 0,
                luk: 7,
            }
        },
        overall: {
            name: "katinas",
            stats: {
                dex: 6,
                luk: 40,
            }
        },
        cape: {
            name: "bfc",
            att: 18,
            stats: {
                str: 0,
                dex: 0,
                int: 0,
                luk: 0
            }
        },
        shoes: {
            name: "fs",
            att: 15,
            stats: {
                str: 0,
                dex: 0,
                int: 0,
                luk: 0
            }
        },
        stars: {
            name: "mtk",
            att: 31,
            stats: {
                str: 0,
                dex: 0,
                int: 0,
                luk: 0
            }
        },
        gloves: {
            name: "scg",
            att: 21,
            stats: {
                str: 0,
                dex: 0,
                int: 0,
                luk: 0,
            }
        },
        ring1: {
            name: "valentine",
            stats: {
                str: 3,
                dex: 3,
                int: 3,
                luk: 3,
            },
            att: 1
        },
        ring2: {
            name: "thought",
            stats: {
                str: 0,
                dex: 0,
                luk: 7,
            }
        },
        ring3: {
            name: "strenght",
            stats: {
                str: 5,
                dex: 8,
                luk: 0,
            }
        },
        ring4: {
            name: "krex",
            stats: {
                str: 2,
                dex: 6,
                luk: 6,
            }
        },
        belt: {
            name: "vl",
            att: 4,
            stats: {
                str: 1,
                dex: 3,
                luk: 3,
            },
        },
        pendant: {
            name: "mon",
            att: 8,
            stats: {
                str: 5,
                dex: 6,
                luk: 11,
            }
        },
        pendant2: {
            name: "golden leaf",
            stats: {
                str: 3,
                dex: 3,
                luk: 3,
            }
        },
        weapon: {
            type: "claw",
            att: 91,
            stats: {
                str: 0,
                dex: 0,
                int: 0,
                luk: 19
            }
        }
    },
    weapon: {
        type: "claw",
        att: 91,
        stats: {
            str: 0,
            dex: 0,
            int: 0,
            luk: 19
        }
    }
}

// 5370-9519 with mw
console.log(range(tomp))
console.log(ttDamage(tomp))