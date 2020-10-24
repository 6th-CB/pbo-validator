function getPlayerRole(callsign) {
    const roleName = (()=>{
        const parts = (callsign || '').split('@');
        if (parts.length === 1) {
            return parts[0];
        } else {
            return parts.slice(0, parts.length - 1).join('@');
        }
    })();
    const normalizedName = roleName.trim().toLowerCase().replace(/[()]/u, '').trim();
    if (/(medic|cls)/gu.test(normalizedName)) {
        return 'medic';
    }
    if (/(auto[- ]?rifleman)|(machine[- ]?gunner)/gu.test(normalizedName)) {
        return 'autorifleman';
    }
    if (/(ammo[- ]?bearer)|(weapons?[- ]assistant)/gu.test(normalizedName)) {
        return 'ammobearer';
    }
    if (/(sl)|(squad[- ]?lead(er)?)/gu.test(normalizedName)) {
        return 'sl';
    }
    if (/(tl)|(team[- ]?lead(er)?)/gu.test(normalizedName)) {
        return 'tl';
    }
    if (/(lat([- ]rifleman)?)|(rifleman[- ]at)|(light[- ]at)|(light[- ]at[- ]rifleman)/gu.test(normalizedName)) {
        return 'lat';
    }
    if (/(at([- ]specialist)?)|(missile specialist at)/gu.test(normalizedName)) {
        return 'at';
    }
    if (/(aa([- ]specialist)?)|(rifleman[- ]aa)|(missile specialist aa)/gu.test(normalizedName)) {
        return 'aa';
    }
    if (/(marksman)/gu.test(normalizedName)) {
        return 'marksman';
    }
    if (/(rifleman)/gu.test(normalizedName)) {
        return 'rifleman';
    }
    if (/(engineer)|(eod([- ]specialist)?)/gu.test(normalizedName)) {
        return 'engineer';
    }
    if (/(commander)/gu.test(normalizedName)) {
        return 'commander';
    }
    if (/(uav([- ]operator)?)/gu.test(normalizedName)) {
        return 'uav';
    }
    if (/(loader)/gu.test(normalizedName)) {
        return 'loader';
    }
    if (/(gunner)/gu.test(normalizedName)) {
        return 'gunner';
    }
    if (/(((rotary)|(fighter)|(heli(copter)?)|(cargo)|(transport)[- ])?(co[- ])?pilot)|(air[- ]?man)|(air[- ]?crew)|(raven)/gu.test(normalizedName)) {
        return 'pilot';
    }
    if (/((armored[- ])?crew[- ]?man)/gu.test(normalizedName)) {
        return 'crewman';
    }
    if (/(officer)/gu.test(normalizedName)) {
        return 'officer';
    }
}

module.exports = {
    getPlayerRole,
};
