const axios = require('axios');
const {parsePboString, BinarizedPboError} = require('./util/parsePbo');
const getRelevant = require('./util/getRelevant');
const validate = require('./util/validate');
const discordUtil = require('./util/discord');
const {getPlayerRole} = require('./util/playerRole');

discordUtil.init();

discordUtil.getClient()
    .then(client => {
        const channel = client.guilds.resolve(process.env.DISCORD_GUILD_ID).channels.resolve(process.env.DISCORD_CHANNEL_ID);
        const messageCollector = channel.createMessageCollector(() => true);
        messageCollector.on('collect', async message => {
            try {
                const attachments = message.attachments;
                const pbo = attachments.find(attachment => attachment.name.toLowerCase().endsWith('.pbo'));
                if (pbo) {
                    const res = await axios.get(pbo.url);
                    try {
                        const parsed = parsePboString(res.data);
                        const relevant = getRelevant(parsed);
                        
                        const squads = relevant.playerSquads.map(squad => {
                            const elementRoles = squad.elements.map(element => getPlayerRole(element.callsign));
                            const roleCounts = {
                                SL: elementRoles.filter(role => role === 'sl').length,
                                TL: elementRoles.filter(role => role === 'tl').length,
                                Autorifleman: elementRoles.filter(role => role === 'autorifleman').length,
                                Marksman: elementRoles.filter(role => role === 'marksman').length,
                                Medic: elementRoles.filter(role => role === 'medic').length,
                                Rifleman: elementRoles.filter(role => role === 'rifleman').length,
                                LAT: elementRoles.filter(role => role === 'lat').length,
                                AT: elementRoles.filter(role => role === 'at').length,
                                AA: elementRoles.filter(role => role === 'aa').length,
                                Engineer: elementRoles.filter(role => role === 'engineer').length,
                                Ammobearer: elementRoles.filter(role => role === 'ammobearer').length,
                                Commander: elementRoles.filter(role => role === 'commander').length,
                                ['UAV operator']: elementRoles.filter(role => role === 'uav').length,
                                Loader: elementRoles.filter(role => role === 'loader').length,
                                Gunner: elementRoles.filter(role => role === 'gunner').length,
                                Pilot: elementRoles.filter(role => role === 'pilot').length,
                                Crewman: elementRoles.filter(role => role === 'crewman').length,
                                Officer: elementRoles.filter(role => role === 'officer').length,
                            };
                            return {
                                name: squad.callsign,
                                roles: {
                                    ...roleCounts,
                                    Unknown: squad.elements.length - Object.values(roleCounts).reduce((sum, cur) => sum + cur, 0),
                                },
                            };
                        });
                        const squadsStr = squads.map(squad => {
                            const roles = Object.entries(squad.roles).map(([key, value]) => {
                                if (value === 0) {
                                    return null;
                                }
                                if (value === 1) {
                                    return key;
                                }
                                return `${key} x${value}`;
                            }).filter(v => !!v).join(', ');
                            return `${squad.name}: ${roles}`;
                        }).join('\n');
                        await channel.send(`Validating "${pbo.name}" - ${relevant.briefingName}\n${squadsStr}`);

                        const validationErrors = validate(relevant);
                        if (validationErrors.length === 0) {
                            await channel.send(`No validation errors found in "${pbo.name}"`);
                        } else {
                            const errorStrings = [];
                            validationErrors.forEach(err => {
                                const peek = () => errorStrings.length === 0 ? '' : errorStrings[errorStrings.length - 1];
                                const append = val => {
                                    if (errorStrings.length === 0) {
                                        errorStrings.push(val);
                                    } else {
                                        errorStrings[errorStrings.length - 1] = errorStrings[errorStrings.length - 1].concat(val);
                                    }
                                };
    
                                const maxMessageLength = 2000;
                                if (errorStrings.length !== 0 && (peek() + ', ' + err).length < maxMessageLength) {
                                    append(', ' + err);
                                } else {
                                    errorStrings.push(err);
                                }
                            });
                            errorStrings.forEach(async errStr => {
                                await channel.send(errStr);
                            });
                        }
    
                    } catch(err) {
                        if (err instanceof BinarizedPboError) {
                            await channel.send(`Skipping validation of "${pbo.name}" because it's binarized.`);
                        } else {
                            throw err;
                        }
                    }
                }
            } catch(err) {
                channel.send(`I just shat myself.\n> ${err.stack.split('\n').join('\n> ').replace('    ', '')}`);
            }
        });
    })
    .catch(e => {
        console.log(e);
    });

process
    .on('unhandledRejection', (exception, promise) => {
        console.log('Unhandled rejection at Promise');
        console.log(exception.toString());
        console.log(exception.stack);
        console.log(promise);
    })
    .on('uncaughtException', exception => {
        console.log('Unhandled exception thrown');
        console.log(exception.toString());
        console.log(exception.stack);
    });
