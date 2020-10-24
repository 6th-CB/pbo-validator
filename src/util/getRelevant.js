const flagNames = [
    'FLAG_AAF_F',
    'ACE_Flag_Black',
    'ACE_Flag_White',
    'Flag_AltisColonial_F',
    'Flag_Altis_F',
    'Flag_ARMEX_F',
    'Flag_BI_F',
    'Flag_Blue_F',
    'Flag_Blueking_F',
    'Flag_Blueking_inverted_F',
    'Flag_Burstkoke_F',
    'Flag_Burstkoke_inverted_F',
    'Flag_CSAT_F',
    'Flag_CTRG_F',
    'Flag_FD_Blue_F',
    'Flag_FD_Green_F',
    'Flag_FD_Orange_F',
    'Flag_FD_Purple_F',
    'Flag_FD_Red_F',
    'Flag_FIA_F',
    'Flag_Fuel_F',
    'Flag_Fuel_inverted_F',
    'Flag_Gendarmerie_F',
    'Flag_Green_F',
    'Flag_HorizonIslands_F',
    'Flag_IDAP_F',
    'Flag_ION_F',
    'Flag_Larkin_F',
    'Flag_EAF_F',
    'Flag_Enoch_F',
    'Flag_NATO_F',
    'Flag_POWMIA_F',
    'Flag_Quontrol_F',
    'Flag_RedCrystal_F',
    'Flag_Red_F',
    'Flag_Redburger_F',
    'Flag_Redstone_F',
    'Flag_Suatmm_F',
    'Flag_Syndikat_F',
    'Flag_UK_F',
    'Flag_UNO_F',
    'Flag_US_F',
    'Flag_Viper_F',
    'Flag_Vrana_F',
    'Flag_White_F',
    'ACE_Rallypoint_East',
    'ACE_Rallypoint_East_Base',
    'ACE_Rallypoint_Independent',
    'ACE_Rallypoint_Independent_Base',
    'ACE_Rallypoint_West',
    'ACE_Rallypoint_West_Base',
];

const bannerNames = [
    'Banner_01_F',
    'Banner_01_AAF_F',
    'Banner_01_CSAT_F',
    'Banner_01_FIA_F',
    'Banner_01_IDAP_F',
    'Banner_01_EAF_F',
    'Banner_01_NATO_F',
];

const equipmentCrateNames = [
    'ACE_Box_Misc',
    'VirtualReammoBox_camonet_F',
    'VirtualReammoBox_F',
    'Box_IND_Ammo_F',
    'Box_T_East_Ammo_F',
    'Box_East_Ammo_F',
    'Box_EAF_Ammo_F',
    'Box_NATO_Ammo_F',
    'Box_Syndicate_Ammo_F',
    'Box_IND_Wps_F',
    'Box_T_East_Wps_F',
    'Box_East_Wps_F',
    'Box_EAF_Wps_F',
    'Box_T_NATO_Wps_F',
    'Box_NATO_Wps_F',
    'Box_Syndicate_Wps_F',
    'Box_AAF_Equip_F',
    'Box_CSAT_Equip_F',
    'Box_IDAP_Equip_F',
    'Box_EAF_Equip_F',
    'Box_NATO_Equip_F',
    'Box_IED_Exp_F',
    'Box_IND_AmmoOrd_F',
    'Box_East_AmmoOrd_F',
    'Box_IDAP_AmmoOrd_F',
    'Box_EAF_AmmoOrd_F',
    'Box_NATO_AmmoOrd_F',
    'Box_FIA_Ammo_F',
    'Box_FIA_Support_F',
    'Box_FIA_Wps_F',
    'Box_IND_Grenades_F',
    'Box_East_Grenades_F',
    'Box_EAF_Grenades_F',
    'Box_NATO_Grenades_F',
    'Box_IND_WpsLaunch_F',
    'Box_East_WpsLaunch_F',
    'Box_EAF_WpsLaunch_F',
    'Box_NATO_WpsLaunch_F',
    'Box_Syndicate_WpsLaunch_F',
    'Box_IND_WpsSpecial_F',
    'Box_T_East_WpsSpecial_F',
    'Box_East_WpsSpecial_F',
    'Box_EAF_WpsSpecial_F',
    'Box_T_NATO_WpsSpecial_F',
    'Box_NATO_WpsSpecial_F',
    'I_supplyCrate_F',
    'O_supplyCrate_F',
    'C_T_supplyCrate_F',
    'C_supplyCrate_F',
    'IG_supplyCrate_F',
    'Box_GEN_Equip_F',
    'C_IDAP_supplyCrate_F',
    'I_EAF_supplyCrate_F',
    'B_supplyCrate_F',
    'Box_IND_Support_F',
    'Box_East_Support_F',
    'Box_EAF_Support_F',
    'Box_NATO_Support_F',
];

function getItems(obj) {
    const length = obj.items;
    const arr = [];
    for (let i = 0; i < length; ++i) {
        arr.push(obj[`Item${i}`]);
    }
    return arr;
}

function getAttributes(obj) {
    const length = obj.nAttributes;
    const arr = [];
    for (let i = 0; i < length; ++i) {
        arr.push(obj[`Attribute${i}`]);
    }
    return arr;
}

function getProperties(attributes) {
    const properties = {};
    attributes.forEach(attribute => {
        properties[attribute.property] = attribute;
    });
    return properties;
}

module.exports = function (pbo) {
    const relevantData = {
        aiIsDisabled: pbo.ScenarioData.disabledAI === 1,
        respawnOnCustomPosition: pbo.ScenarioData.respawn === 3,
        respawnDelay: pbo.ScenarioData.respawnDelay,
    };
    
    const multiplayerCategory = pbo.CustomAttributes && Object.values(pbo.CustomAttributes).find(category => category.name === 'Multiplayer');
    if (multiplayerCategory) {
        const attributes = getAttributes(multiplayerCategory);
        const respawnAttribute = attributes.find(attribute => attribute.property.startsWith('ENH_respawnTickets_'));
        relevantData.respawnTickets = respawnAttribute.Value.data.value;

        const saveLoadoutAttribute = attributes.find(attribute => attribute.property === 'ENH_saveLoadout');
        relevantData.saveLoadout = saveLoadoutAttribute && saveLoadoutAttribute.Value.data.value;
    } else {
        relevantData.respawnTickets = null;
        relevantData.saveLoadout = null;
    }

    const entities = getItems(pbo.Mission.Entities);

    const markers = entities.filter(entity => entity.dataType === 'Marker');
    relevantData.respawnMarkers = markers.filter(marker => marker.name.startsWith('respawn_')).map(marker => ({
        position: {
            x: marker.position[0],
            y: marker.position[1],
            z: marker.position[2],
        },
        name: marker.name,
        text: marker.text,
        side: (value => {
            switch(value.toLowerCase()) {
                case 'respawn_west':
                    return 'blufor';
                case 'respawn_east':
                    return 'opfor';
                case 'respawn_guerilla':
                    return 'greenfor';
            }
        })(marker.name),
    }));

    const tfarEnforceUsage = entities.find(entity => entity.type === 'tfar_ModuleTaskForceRadioEnforceUsage');
    relevantData.tfarEnforceUsageModule = tfarEnforceUsage ? (()=>{
        const attributes = getAttributes(tfarEnforceUsage.CustomAttributes);
        const properties = getProperties(attributes);
        return {
            channelName: properties.tfar_ModuleTaskForceRadioEnforceUsage_radio_channel_name && properties.tfar_ModuleTaskForceRadioEnforceUsage_radio_channel_name.Value.data.value,
            channelPassword: properties.tfar_ModuleTaskForceRadioEnforceUsage_radio_channel_name && properties.tfar_ModuleTaskForceRadioEnforceUsage_radio_channel_name.Value.data.value,
            giveRiflemanRadio: properties.tfar_ModuleTaskForceRadioEnforceUsage_RiflemanRadio && properties.tfar_ModuleTaskForceRadioEnforceUsage_RiflemanRadio.Value.data.value,
            giveLeadersLongRangeRadio: properties.tfar_ModuleTaskForceRadioEnforceUsage_TeamLeaderRadio && properties.tfar_ModuleTaskForceRadioEnforceUsage_TeamLeaderRadio.Value.data.value,
            sameSwFrequenciesForSide: properties.tfar_ModuleTaskForceRadioEnforceUsage_same_sw_frequencies_for_side && properties.tfar_ModuleTaskForceRadioEnforceUsage_same_sw_frequencies_for_side.Value.data.value,
            sameLrFrequenciesForSide: properties.tfar_ModuleTaskForceRadioEnforceUsage_same_lr_frequencies_for_side && properties.tfar_ModuleTaskForceRadioEnforceUsage_same_lr_frequencies_for_side.Value.data.value,
        };
    })() : null;

    const acexFortifies = entities.filter(entity => entity.type === 'acex_fortify_setupModule');
    relevantData.acexFortifyModules = acexFortifies.map(acexFortify => {
        const attributes = getAttributes(acexFortify.CustomAttributes);
        const properties = getProperties(attributes);
        return {
            autoAddFortifyItem: properties.acex_fortify_setupModule_AddToolItem.Value.data.value,
            budget: properties.acex_fortify_setupModule_Budget.Value.data.value,
            side: (value=>{
                switch(value) {
                    case 1:
                        return 'blufor';
                    case 2:
                        return 'opfor';
                    case 3:
                        return 'greenfor';
                    case 4:
                        return 'civfor';
                }
            })(properties.acex_fortify_setupModule_Side.Value.data.value),
            preset: properties.acex_fortify_setupModule_Preset.Value.data.value,
        };
    });

    const headlessClient = entities.find(entity => entity.type === 'HeadlessClient_F');
    relevantData.headlessClient = headlessClient ? (()=>{
        return {
            name: headlessClient.name,
            isPlayable: headlessClient.isPlayable,
        };
    })() : null;

    const zeuses = entities.filter(entity => entity.dataType === 'Logic' && entity.type === 'ModuleCurator_F');
    relevantData.zeuses = zeuses.map(zeus => {
        const attributes = getAttributes(zeus.CustomAttributes);
        const properties = getProperties(attributes);
        return {
            name: properties.ModuleCurator_F_Name && properties.ModuleCurator_F_Name.Value.data.value,
            owner: properties.ModuleCurator_F_Owner && properties.ModuleCurator_F_Owner.Value.data.value,
            forced: properties.ModuleCurator_F_Forced && properties.ModuleCurator_F_Forced.Value.data.value,
            addons: properties.ModuleCurator_F_Addons && properties.ModuleCurator_F_Addons.Value.data.value,
        };
    });

    relevantData.squads = entities
        .filter(entity => entity.dataType === 'Group')
        .map(squad => {
            const customAttributes = squad.CustomAttributes && getAttributes(squad.CustomAttributes);
            const callsignAttribute = customAttributes && customAttributes.find(attribute => attribute.expression && attribute.expression.includes('CBA_fnc_setCallsign'));
            const squadEntities = getItems(squad.Entities);
            const getSide = side => {
                switch(side) {
                    case 'West':
                        return 'blufor';
                    case 'East':
                        return 'opfor';
                    case 'Independent':
                        return 'greenfor';
                    case 'Civilian':
                        return 'civfor';
                }
            };
            return {
                side: getSide(squad.side),
                name: squad.Attributes && squad.Attributes.name,
                callsign: callsignAttribute && callsignAttribute.Value.data.value,
                elements: squadEntities.filter(entity => entity.dataType === 'Object').map(entity => {
                    const position = entity.PositionInfo;
                    const inventory = entity.Attributes.Inventory;
                    return {
                        position: {
                            x: position.position[0],
                            y: position.position[1],
                            z: position.position[2],
                        },
                        side: getSide(entity.side),
                        flags: entity.flags,
                        variableName: entity.Attributes.name,
                        callsign: entity.Attributes.description,
                        isPlayer: entity.Attributes.isPlayer,
                        isPlayable: entity.Attributes.isPlayable,
                        inventory: inventory && {
                            binocular: inventory.binocular,
                            map: inventory.map,
                            compass: inventory.compass,
                            watch: inventory.watch,
                            radio: inventory.radio,
                            gps: inventory.gps,
                            headgear: inventory.headgear,
                            primaryWeapon: inventory.primaryWeapon && {
                                name: inventory.primaryWeapon.name,
                                optics: inventory.primaryWeapon.optics,
                                flashlight: inventory.primaryWeapon.flashlight,
                                magazine: inventory.primaryWeapon.primaryMuzzleMag && {
                                    name: inventory.primaryWeapon.primaryMuzzleMag.name,
                                    ammo: inventory.primaryWeapon.primaryMuzzleMag.ammoLeft,
                                },
                            },
                            secondaryWeapon: inventory.secondaryWeapon && {
                                name: inventory.secondaryWeapon.name,
                                magazine: inventory.secondaryWeapon.primaryMuzzleMag && {
                                    name: inventory.secondaryWeapon.primaryMuzzleMag.name,
                                    ammo: inventory.secondaryWeapon.primaryMuzzleMag.ammo,
                                },
                            },
                            handgun: inventory.handgun && {
                                name: inventory.handgun.name,
                                magazine: inventory.handgun.primaryMuzzleMag && {
                                    name: inventory.handgun.primaryMuzzleMag.name,
                                    ammo: inventory.handgun.primaryMuzzleMag.ammoLeft,
                                },
                            },
                            uniform: inventory.uniform && {
                                name: inventory.uniform.typeName,
                                content: inventory.uniform.ItemCargo && getItems(inventory.uniform.ItemCargo).map(item => ({
                                    name: item.name,
                                    count: item.count,
                                })),
                            },
                            vest: inventory.vest && {
                                name: inventory.vest.name,
                                magazine: inventory.vest.MagazineCargo && getItems(inventory.vest.MagazineCargo).map(item => ({
                                    name: item.name,
                                    count: item.count,
                                    ammo: item.ammoLeft,
                                })),
                                content: inventory.vest.ItemCargo && getItems(inventory.vest.ItemCargo).map(item => ({
                                    name: item.name,
                                    count: item.count,
                                })),
                            },
                            backpack: inventory.backpack && {
                                name: inventory.backpack.typeName,
                                content: inventory.backpack.ItemCargo && getItems(inventory.backpack.ItemCargo).map(item => ({
                                    name: item.name,
                                    count: item.count,
                                })),
                            },
                        },
                    };
                }),
            };
        });
    
    relevantData.playerSquads = relevantData.squads.filter(squad =>
        squad.elements.find(element =>
            element.isPlayer || element.isPlayable));

    relevantData.players = relevantData.playerSquads
        .map(squad => squad.elements)
        .reduce((prev, cur) => [...prev, ...cur], [])
        .filter(element => element.isPlayer || element.isPlayable);

    relevantData.flags = entities
        .filter(entity => [...flagNames, ...bannerNames].includes(entity.type))
        .map(flag => ({
            type: flag.type,
            position: flag.PositionInfo && {
                x: flag.PositionInfo.position[0],
                y: flag.PositionInfo.position[1],
                z: flag.PositionInfo.position[2],
            },
        }));

    const selfHealItem = entities.find(entity => entity.Attributes && entity.Attributes.init === 'call{this addAction [\\"Heal\\", {[objNull, player] call ace_medical_treatment_fnc_fullHeal}];}');
    relevantData.hasSelfHealItem = !!selfHealItem;

    relevantData.aceMedicalCrates = entities
        .filter(entity => entity.type === 'ACE_medicalSupplyCrate' || entity.type === 'ACE_medicalSupplyCrate_advanced')
        .map(medicalCrate => ({
            position: {
                x: medicalCrate.PositionInfo.position[0],
                y: medicalCrate.PositionInfo.position[1],
                z: medicalCrate.PositionInfo.position[2],
            },
            type: (()=>{
                switch(medicalCrate.type) {
                    case 'ACE_medicalSupplyCrate_advanced':
                        return 'advanced';
                    case 'ACE_medicalSupplyCrate':
                        return 'simple';
                }
            })(),
        }));

    relevantData.equipmentCrates = entities
        .filter(entity => equipmentCrateNames.includes(entity.type))
        .map(crate => ({
            type: crate.type,
            position: crate.PositionInfo && {
                x: crate.PositionInfo.position[0],
                y: crate.PositionInfo.position[1],
                z: crate.PositionInfo.position[2],
            },
            content: (()=>{
                const attributes = crate.CustomAttributes && getAttributes(crate.CustomAttributes);
                const properties = attributes && getProperties(attributes);
                const value = properties && properties.ammoBox && properties.ammoBox.Value.data.value;
                return (crateContent => {
                    if (!crateContent) {
                        return null;
                    }
                    let asJson = null;
                    try {
                        asJson = JSON.parse(crateContent);
                    } catch(e) {
                        return null;
                    }
                    return asJson[0].map(([names, amounts]) => {
                        const arr = [];
                        for (let i = 0; i < names.length && i < amounts.length; ++i) {
                            arr.push({
                                name: names[i],
                                amount: amounts[i],
                            });
                        }
                        return arr;
                    }).reduce((prev, cur) => [...prev, ...cur], []);
                })(value);
            })(),
        }));
    
    const gameLogics = entities.filter(entity =>
        entity.dataType === 'Logic' && (
            entity.type === 'Logic' ||
            entity.type === 'VirtualAISquad'
        ));
    const viewDistanceGameLogic = gameLogics.find(gameLogic => gameLogic.init === 'call{setViewDistance 20000;}');
    relevantData.isViewDistanceSet = !!viewDistanceGameLogic;

    return relevantData;
};
