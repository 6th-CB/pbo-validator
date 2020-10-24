function distance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z));
}

function getPlayerRole(callsign) {
    const roleName = (()=>{
        const parts = (callsign || '').split('@');
        if (parts.length === 1) {
            return parts[0];
        } else {
            return parts.slice(0, parts.length - 1).join('@');
        }
    })();
    switch (roleName.trim().toLowerCase()) {
        case 'medic':
        case 'cls':
            return 'medic';
        case 'autorifleman':
        case 'auto rifleman':
        case 'auto-rifleman':
        case 'machinegunner':
        case 'machine gunner':
        case 'machine-gunner':
            return 'autorifleman';
        case 'ammobearer':
        case 'ammo bearer':
        case 'ammo-bearer':
        case 'weapons assistant':
        case 'weapons-assistant':
        case 'weapon assistant':
        case 'weapon-assistant':
            return 'ammobearer';
        case 'sl':
        case 'squad leader':
        case 'squad-leader':
        case 'squadleader':
        case 'squad lead':
        case 'squad-lead':
        case 'squadlead':
            return 'sl';
        case 'tl':
        case 'team leader':
        case 'team-leader':
        case 'teamleader':
        case 'team lead':
        case 'team-lead':
        case 'teamelead':
            return 'tl';
        case 'rifleman at':
        case 'rifleman-at':
        case 'lat':
        case 'light at':
        case 'light-at':
        case 'lat rifleman':
        case 'lat-rifleman':
        case 'light at rifleman':
        case 'light-at-rifleman':
            return 'lat';
        case 'at':
        case 'at specialist':
        case 'at-specialist':
        case 'missile specialist at':
            return 'at';
        case 'aa':
        case 'aa specialist':
        case 'aa-specialist':
        case 'rifleman aa':
        case 'rifleman-aa':
        case 'missile specialist aa':
            return 'aa';
        case 'marksman':
            return 'marksman';
        case 'rifleman':
            return 'rifleman';
        case 'engineer':
            return 'engineer';
        case 'commander':
            return 'commander';
        case 'uav':
        case 'uav operator':
        case 'uav-operator':
            return 'uav';
        case 'loader':
            return 'loader';
        case 'gunner':
            return 'gunner';
        case 'pilot':
        case 'copilot':
        case 'co pilot':
        case 'co-pilot':
        case 'rotary pilot':
        case 'rotary-pilot':
        case 'fighter pilot':
        case 'fighter-pilot':
        case 'heli pilot':
        case 'heli-pilot':
        case 'helicopter pilot':
        case 'helicopter-pilot':
        case 'cargo pilot':
        case 'cargo-pilot':
        case 'transport pilot':
        case 'transport-pilot':
        case 'airman':
        case 'air crew':
        case 'air-crew':
        case 'aircrew':
        case 'raven':
            return 'pilot';
    }
}

module.exports = function validate(data) {
    function validateGeneral() {
        const validationErrors = [];
        if (!data.aiIsDisabled) {
            validationErrors.push('AI is not disabled');
        }

        if (data.saveLoadout !== 1) {
            validationErrors.push('Loadout is not saved');
        }
    
        return validationErrors;
    }

    function validateRespawn() {
        const validationErrors = [];
        if (!data.respawnOnCustomPosition) {
            validationErrors.push('Respawn is not on custom position');
        }
        if (data.respawnDelay < 5 || data.respawnDelay > 10) {
            validationErrors.push(`Respawn time (${data.respawnDelay}) is not between 5 to 10`);
        }

        if (data.respawnMarkers.length === 0) {
            validationErrors.push('No respawn marker set');
        }

        const playerSides = {};
        data.players.map(player => player.side).forEach(side => {playerSides[side] = true;});
        const respawnMarkerSides = data.respawnMarkers.map(marker => marker.side);
        Object.keys(playerSides).forEach(playerSide => {
            if (!respawnMarkerSides.includes(playerSide)) {
                validationErrors.push(`Respawn marker missing for player side ${playerSide}`);
            }
        });
    
        return validationErrors;
    }

    function validateTickets() {
        const validationErrors = [];
        if (data.respawnTickets === null) {
            validationErrors.push('Respawn tickets not set up');
        }
        if (data.respawnTickets !== 25) {
            validationErrors.push(`Respawn tickets are not 25 (${data.respawnTickets})`);
        }
        return validationErrors;
    }

    function validateTfar() {
        const validationErrors = [];
        if (!data.tfarEnforceUsageModule) {
            validationErrors.push('TFAR module doesn\'t exist');
        } else {
            if (data.tfarEnforceUsageModule.channelName !== 'TFAR') {
                validationErrors.push(`TFAR channel name is wrong (${data.tfarEnforceUsageModule.channelName})`);
            }
            if (data.tfarEnforceUsageModule.channelPassword !== '1234') {
                validationErrors.push(`TFAR channel password is wrong (${data.tfarEnforceUsageModule.channelPassword})`);
            }
            if (data.tfarEnforceUsageModule.giveRiflemanRadio !== 0) {
                validationErrors.push('TFAR set to give riflemen radios');
            }
            if (data.tfarEnforceUsageModule.giveLeadersLongRangeRadio !== 0) {
                validationErrors.push('TFAR set to give SL/TLs radios');
            }
            if (data.tfarEnforceUsageModule.sameSwFrequenciesForSide !== 0) {
                validationErrors.push('TFAR set to same sw freq for side');
            }
            if (data.tfarEnforceUsageModule.sameLrFrequenciesForSide !== 0) {
                validationErrors.push('TFAR set to same lr freq for side');
            }
        }
        return validationErrors;
    }

    function validateFortify() {
        const validationErrors = [];
        if (data.acexFortifyModules.length === 0) {
            validationErrors.push('ACEX Fortify module doesn\'t exist');
        } else {
            data.acexFortifyModules.forEach(fortifyModule => {
                if (fortifyModule.autoAddFortifyItem !== 0) {
                    validationErrors.push('ACEX Fortify set to auto-add fortify item');
                }
                if (fortifyModule.budget !== 300) {
                    validationErrors.push(`ACEX Fortify budget not set to 300 (${fortifyModule.budget})`);
                }
                if (fortifyModule.preset !== 'small' && fortifyModule.preset !== 'smallGreen') {
                    validationErrors.push(`ACEX Fortify preset not set to small (${fortifyModule.preset})`);
                }
            });

            const playerSides = {};
            data.players.map(player => player.side).forEach(side => {playerSides[side] = true;});
            const fortifyModuleSides = {};
            data.acexFortifyModules.map(module => module.side).forEach(side => {fortifyModuleSides[side] = true;});
            Object.keys(playerSides).forEach(playerSide => {
                if (!Object.keys(fortifyModuleSides).includes(playerSide)) {
                    validationErrors.push(`ACEX Fortify module missing for side ${playerSide}`);
                }
            });
        }
        return validationErrors;
    }

    function validateHeadlessClient() {
        const validationErrors = [];
        if (!data.headlessClient) {
            validationErrors.push('Headless client doesn\'t exist');
        } else {
            if (data.headlessClient.name !== 'HC1') {
                validationErrors.push(`Headless client name isn't HC1 (${data.headlessClient.name})`);
            }
            if (data.headlessClient.isPlayable !== 1) {
                validationErrors.push('Headless client isn\'t playable');
            }
        }
        return validationErrors;
    }

    function validateZeus() {
        const validationErrors = [];
        let adminLoggedExists = false;
        data.zeuses.forEach(zeus => {
            if (zeus.owner === '#adminLogged') {
                adminLoggedExists = true;
            } else {
                const owner = data.players.find(player => player.variableName === zeus.owner);
                if (!owner) {
                    validationErrors.push(`Zeus "${zeus.name}" owner (${zeus.owner}) doesn't exist or isn't a player`);
                }
            }
    
            if (zeus.addons !== 3) {
                validationErrors.push(`Zeus "${zeus.name}" addons are misconfigured`);
            }
        });
        if (!adminLoggedExists) {
            validationErrors.push('Zeus that is #adminLogged doesn\'t exist');
        }
        return validationErrors;
    }

    function validateFlags() {
        const validationErrors = [];
        if (
            data.flags.filter(flag => {
                const distances = data.respawnMarkers.map(marker => distance(marker.position, flag.position));
                const minDistance = distances.reduce((min, cur) => cur < min ? cur : min, Infinity);
                return minDistance <= 1000;
            }).length === 0
        ) {
            validationErrors.push('No briefing flags close to respawn');
        }
        return validationErrors;
    }

    function validateSelfHeal() {
        const validationErrors = [];
        if (!data.hasSelfHealItem) {
            validationErrors.push('No self-heal item (dumbfuck juice)');
        }
        return validationErrors;
    }

    function validateViewDistance() {
        const validationErrors = [];
        if (!data.isViewDistanceSet) {
            validationErrors.push('gameLogic with setViewDistance not set');
        }
        return validationErrors;
    }

    function validateCrates() {
        const medicalCrates = data.aceMedicalCrates.filter(crate => {
            const distances = data.respawnMarkers.map(marker => distance(marker.position, crate.position));
            const minDistance = distances.reduce((min, cur) => cur < min ? cur : min, Infinity);
            return minDistance <= 1000;
        });
        const equipmentCrates = data.equipmentCrates.filter(crate => {
            const distances = data.respawnMarkers.map(marker => distance(marker.position, crate.position));
            const minDistance = distances.reduce((min, cur) => cur < min ? cur : min, Infinity);
            return minDistance <= 1000;
        });

        const validationErrors = [];
        if (medicalCrates.length < 5) {
            validationErrors.push(`Insufficient medical crates near spawn (need >=5, has ${medicalCrates.length} within 1km of spawn)`);
        }
        if (equipmentCrates.length < 5) {
            validationErrors.push(`Insufficient equipment crates near spawn (need >=5, has ${equipmentCrates.length} within 1km of spawn)`);
        }
        return validationErrors;
    }

    function validatePlayerSquads() {
        const validationErrors = [];
        data.playerSquads.forEach(squad => {
            if (squad.elements.length === 10) {
                const elementRoles = squad.elements.map(element => getPlayerRole(element.callsign));
                const roleCounts = {
                    sl: elementRoles.filter(role => role === 'sl').length,
                    tl: elementRoles.filter(role => role === 'tl').length,
                    autorifleman: elementRoles.filter(role => role === 'autorifleman').length,
                    marksman: elementRoles.filter(role => role === 'marksman').length,
                    medic: elementRoles.filter(role => role === 'medic').length,
                    rifleman: elementRoles.filter(role => role === 'rifleman').length,
                    lat: elementRoles.filter(role => role === 'lat').length,
                    at: elementRoles.filter(role => role === 'at').length,
                    aa: elementRoles.filter(role => role === 'aa').length,
                    engineer: elementRoles.filter(role => role === 'engineer').length,
                    ammobearer: elementRoles.filter(role => role === 'ammobearer').length,
                };

                const validateRoleCount = (roleKey, roleName, count) => {
                    if (roleCounts[roleKey] !== count) {
                        validationErrors.push(`${roleCounts[roleKey] < count ? 'Insufficient' : 'Too many'} ${roleName} in squad ${squad.callsign || squad.name}`);
                    }
                };
                validateRoleCount('sl', 'SLs', 1);
                validateRoleCount('tl', 'TLs', 1);
                validateRoleCount('lat', 'light AT', 1);
                validateRoleCount('autorifleman', 'autoriflemen', 2);
                validateRoleCount('marksman', 'marksman', 1);
                validateRoleCount('medic', 'medics', 2);
            }
        });
        return validationErrors;
    }

    function validatePlayerEquipment() {
        const universalLoadout = {
            quickClotBandage: 5,
            packingBandage: 5,
            elasticBandage: 5,
            cableTie: 3,
            earplugs: 1,
            entrenchingTool: 1,
            epinephrine: 2,
            mapLamp: 1,
            mapTools: 1,
            morphine: 2,
            saline250: 1,
            splint: 4,
            tourniquet: 4,
            radio: 1,
            primaryMags: 5,
            sidearmMags: 2,
            autoriflemanMags: 1,
            smokeWhite: 2,
            grenade: 2,
            helmetCamera: 1,
            ctabAndroid: 1,
        };
        const equipmentRequirements = {
            medic: {
                elasticBandage: 25,
                packingBandage: 25,
                quickClotBandage: 25,
                morphine: 5,
                epinephrine: 5,
                tourniquet: 2,
                splint: 6,
                saline1000: 3,
                saline500: 5,
                saline250: 2,
                surgicalKit: 1,
            },
            autorifleman: {
                spareBarrel: 1,
                tracerMags: {
                    or: [{
                        primaryMags100: 5,
                    }, {
                        primaryMags200: 3,
                    }],
                },
            },
            ammobearer: {
                rangefinder: 1,
                autoriflemanMags: 3,
                primaryMags: 10,
                launcherAmmo: {
                    or: [{
                        atAmmo: 1,
                    }, {
                        aaAmmo: 1,
                    }],
                },
            },
            sl: {
                ctabTablet: 1,
                smokeWhite: 4,
                smokeRed: 4,
                smokeBlue: 1,
                smokeGreen: 1,
                smokeOrange: 1,
                smokePurple: 1,
                smokeYellow: 1,
            },
            tl: {
                ctabTablet: 1,
                smokeWhite: 4,
                smokeRed: 4,
                smokeBlue: 1,
                smokeGreen: 1,
                smokeOrange: 1,
                smokePurple: 1,
                smokeYellow: 1,
            },
            lat: {},
            at: {},
            aa: {},
            marksman: {
                rangeCard: 1,
            },
            rifleman: {},
            engineer: {
                defusalKit: 1,
                toolkit: 1,
                fortifyTool: 1,
                mineDetector: 1,
                sprayBlack: 1,
                sprayBlue: 1,
                sprayGreen: 1,
                sprayRed: 1,
            },
            commander: {},
            uav: {},
            loader: {},
            gunner: {},
            pilot: {},
        };

        const validationErrors = [];
        data.playerSquads.forEach(squad => {
            squad.elements.forEach(player => {
                const playerType = getPlayerRole(player.callsign);
                const requirements = (()=>{
                    if (!equipmentRequirements[playerType]) {
                        return null;
                    }
                    const obj = {...equipmentRequirements[playerType]};
                    Object.entries(universalLoadout).forEach(([key, val]) => {
                        obj[key] = (obj[key] || 0) + val;
                    });
                    return obj;
                })();
                if (!requirements) {
                    validationErrors.push(`Skipping equipment validation: Unknown player role (${playerType || player.callsign}) in "${squad.name || squad.callsign}"`);
                    return;
                }

                const inventory = (()=>{
                    const inventoryRaw = [
                        ...(player.uniform && player.uniform.content || []),
                        ...(player.vest && player.vest.magazine || []),
                        ...(player.vest && player.vest.content || []),
                        ...(player.backpack && player.backpack.content || []),
                    ];
                    const inventoryObj = {};
                    inventoryRaw.forEach(item => {
                        const old = inventoryObj[item.name];
                        inventoryObj[item.name] = {
                            name: item.name,
                            count: (item.count || 0) + (old.count || 0),
                            ammo: (item.ammo || 0) + (old.ammo || 0),
                        };
                    });
                    return Object.values(inventoryObj);
                })();

                const validateRequirement = (name, key, validator) => {
                    if (requirements[key]) {
                        if (validator(requirements[key])) {
                            const elementName = playerType || player.callsign || player.variableName;
                            validationErrors.push(`Missing equipment: ${name} of ${elementName || 'someone'} in ${squad.callsign || squad.name}`);
                        }
                    }
                };

                const countInInventory = (names) => {
                    return names.map(name =>
                        (inventory.find(item => item.name === name) || {count: 0}).count
                    )
                        .reduce((sum, cur) => sum + cur, 0);
                };

                validateRequirement('Saline 1L', 'saline1000', count => countInInventory(['ACE_bloodIV', 'ACE_plasmaIV', 'ACE_salineIV']) >= count);
                validateRequirement('Saline 0.5L', 'saline500', count => countInInventory(['ACE_bloodIV_500', 'ACE_plasmaIV_500', 'ACE_salineIV_500']) >= count);
                validateRequirement('Saline 250', 'saline250', count => countInInventory(['ACE_bloodIV_250', 'ACE_plasmaIV_250', 'ACE_salineIV_250']) >= count);
                validateRequirement('Surgical kit', 'surgicalKit', () => inventory.find(item => item.name === 'ACE_surgicalKit'));
                validateRequirement('Adenosine', 'adenosine', count => countInInventory(['ACE_adenosine']) >= count);
                validateRequirement('Epinephrine', 'epinephrine', count => countInInventory(['ACE_epinephrine']) >= count);
                validateRequirement('Morphine', 'morphine', count => countInInventory(['ACE_morphine']) >= count);
                validateRequirement('Field dressing', 'fieldDressingBandage', count => countInInventory(['ACE_fieldDressing']) >= count);
                validateRequirement('Elastic bandage', 'elasticBandage', count => countInInventory(['ACE_elasticBandage']) >= count);
                validateRequirement('Packing bandage', 'packingBandage', count => countInInventory(['ACE_packingBandage']) >= count);
                validateRequirement('Quick clot', 'quickClotBandage', count => countInInventory(['ACE_quikclot']) >= count);
                validateRequirement('Tourniquet', 'tourniquet', count => countInInventory(['ACE_tourniquet']) >= count);
                validateRequirement('Split', 'splint', count => countInInventory(['ACE_splint']) >= count);

                validateRequirement('Cable ties', 'cableTie', count => countInInventory(['ACE_CableTie']) >= count);
                validateRequirement('Earplugs', 'earplugs', count => countInInventory(['ACE_EarPlugs']) >= count);
                validateRequirement('E-Tool', 'entrenchingTool', count => countInInventory(['ACE_EntrenchingTool']) >= count);
                validateRequirement('Helm cam', 'helmetCamera', count => countInInventory(['ItemcTabHCam']) >= count);
                validateRequirement('Map lamp', 'mapLamp', () => countInInventory(['ACE_Flashlight_MX991', 'ACE_Flashlight_XL50']) >= 1);
                validateRequirement('Map tools', 'mapTools', () => inventory.find(item => item.name === 'ACE_MapTools'));
                validateRequirement('Range card', 'rangeCard', () => inventory.find(item => item.name === 'ACE_RangeCard'));
                
                validateRequirement('Smoke blue', 'smokeBlue', count => countInInventory(['SmokeShellBlue']) >= count);
                validateRequirement('Smoke green', 'smokeGreen', count => countInInventory(['SmokeShellGreen']) >= count);
                validateRequirement('Smoke orange', 'smokeOrange', count => countInInventory(['SmokeShellOrange']) >= count);
                validateRequirement('Smoke purple', 'smokePurple', count => countInInventory(['SmokeShellPurple']) >= count);
                validateRequirement('Smoke red', 'smokeRed', count => countInInventory(['SmokeShellRed']) >= count);
                validateRequirement('Smoke yellow', 'smokeYellow', count => countInInventory(['SmokeShellYellow']) >= count);
                validateRequirement('Smoke', 'smokeWhite', count => countInInventory(['SmokeShell']) >= count);
                validateRequirement('Grenade', 'grenade', count => countInInventory(['HandGrenade', 'MiniGrenade']) >= count);
                validateRequirement('Rangefinder', 'rangefinder', () => player.inventory.binocular.name === 'Rangefinder');
                validateRequirement('Radio', 'radio', () => player.inventory.radio === 'tf_anprc152');
                validateRequirement('Spare barrel', 'spareBarrel', count => countInInventory(['ACE_SpareBarrel']) >= count);
                validateRequirement('CTAB Android', 'ctabAndroid', () => player.inventory.gps === 'ItemAndroid');
                validateRequirement('CTAB Tablet', 'ctabTablet', () => player.inventory.gps === 'ItemcTab');

                validateRequirement('Mine detector', 'mineDetector', () => player.inventory.handgun.name === 'ACE_VMM3' || player.inventory.handgun.name === 'ACE_VMH3');
                validateRequirement('Toolkit', 'toolkit', () => inventory.find(item => item.name === 'ToolKit'));
                validateRequirement('Fortify tool', 'fortifyTool', count => countInInventory(['ACE_Fortify']) >= count);
                validateRequirement('Spray paint black', 'sprayBlack', count => countInInventory(['ACE_SpraypaintBlack']) >= count);
                validateRequirement('Spray paint blue', 'sprayBlue', count => countInInventory(['ACE_SpraypaintBlue']) >= count);
                validateRequirement('Spray paint green', 'sprayGreen', count => countInInventory(['ACE_SpraypaintGreen']) >= count);
                validateRequirement('Spray paint red', 'sprayRed', count => countInInventory(['ACE_SpraypaintRed']) >= count);
                validateRequirement('Defusal kit', 'defusalKit', () => inventory.find(item => item.name === 'ACE_DefusalKit'));
                
                // TODO:
                // primaryMags
                // sidearmMags
                // autoriflemanMags
                // tracerMags
                // launcherAmmo
            });
        });
        return validationErrors;
    }

    return [
        ...validateGeneral(),
        ...validateRespawn(),
        ...validateTickets(),
        ...validateTfar(),
        ...validateFortify(),
        ...validateHeadlessClient(),
        ...validateZeus(),
        ...validateFlags(),
        ...validateSelfHeal(),
        ...validateViewDistance(),
        ...validateCrates(),
        ...validatePlayerSquads(),
        ...validatePlayerEquipment(),
    ];
};
