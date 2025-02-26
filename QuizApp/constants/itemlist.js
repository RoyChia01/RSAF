import Colors from "./Colors"
import images from "./images"

export const Desc1 = "This power up item allows you to earn additional points for your next attempted quiz. This item can only be purchased once a week."
export const Desc2 = "This power up item allows you to select a user and reduce their points earned in their next attempted quiz. This item can only be purchased once a week."
export const Desc3 = "This power up item allows you to shield yourself and protect against one attack from other user. This item can only be purchased once a week."
export const Desc4 = "This power up item allows you to either earn or reduce the points gained in your next attempted quiz. This item can only be purchased once a week."

export const itemsList = [
  { id: '101', title: 'Multiplier', subtitle: 'Defence', description: Desc1, image: images.item1, price: 10, bgColor: Colors.item1Bg },
  { id: '102', title: 'Sabotage', subtitle: 'Offence', description: Desc2, image: images.item2, price: 8, bgColor: Colors.item2Bg },
  { id: '103', title: 'Shield', subtitle: 'Defence', description: Desc3, image: images.item3, price: 5, bgColor: Colors.item3Bg },
  { id: '104', title: 'Gamble', subtitle: 'Wildcard', description: Desc4, image: images.item4, price: 10, bgColor: Colors.item4Bg },
]
