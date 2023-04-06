
const _hiSynonyms = ["hi", "hello", "hey", "howdy"]

export const Modules = [
    { id: 1, name: 'Policies' },
    { id: 2, name: 'Claims' },
    { id: 3, name: 'E-Cards' },
    { id: 4, name: 'Enrolment' },
    { id: 5, name: 'Network Hospital' },
    { id: 6, name: 'Change Password' },
    { id: 7, name: 'Help' },
]

export const ECard = [
    "Download E-Card of policy",
    "Now you can download E-card of policy",
    "Your E-card is here,Plaese download for policy",
]

export const NetworkHospital = [
    "Please enter pincode OR Hospital name for Network hospital"
]

export const GenerateRandomMsg = {
    ECard: () => {
        return ECard[Math.floor(Math.random() * ECard.length)];
    },
    NetworkHospital: () => {
        return NetworkHospital[Math.floor(Math.random() * NetworkHospital.length)];
    },
    BotResponse: (userMsg, userName) => {
        if (_hiSynonyms.includes(userMsg.toLowerCase())) {
            return `hello ${userName}, Here are the topics I can help you with`
        } else {
            return "I'm a bot programmed to answer only some of the frequent questions. Here are the topics I can help you with."
        }

    }
}