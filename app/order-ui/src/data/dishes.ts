import { IDish } from '@/types'

const dishes: IDish[] = [
  {
    id: 1,
    name: 'Bún bò',
    image: 'https://bizweb.dktcdn.net/100/489/006/files/cach-nau-bun-bo-gio-heo-2.jpg',
    price: 55000,
    description: 'Món bún bò thơm ngon, đậm đà với nước lèo nấu từ xương bò và sả.',
    type: 'Món chính',
    main_ingredients: ['Bún', 'Bò', 'Sả', 'Rau sống'],
    availability: true,
    preparation_time: 15,
    calories: 350
  },
  {
    id: 2,
    name: 'Bánh mì',
    image: 'https://static.vinwonders.com/production/banh-mi-sai-gon-2.jpg',
    price: 20000,
    description: 'Bánh mì Việt Nam với nhân thịt, pate, rau sống và nước sốt đặc biệt.',
    type: 'Món ăn nhanh',
    main_ingredients: ['Bánh mì', 'Thịt', 'Pate', 'Rau sống'],
    availability: true,
    preparation_time: 5,
    calories: 250
  },
  {
    id: 3,
    name: 'Phở',
    image:
      'https://mia.vn/media/uploads/blog-du-lich/top-19-quan-pho-ha-noi-ngon-nuc-tieng-an-la-ghien-phan-1-06-1639125006.jpg',
    price: 60000,
    description: 'Phở bò truyền thống với nước dùng trong, thơm vị quế và hồi.',
    type: 'Món chính',
    main_ingredients: ['Bánh phở', 'Bò', 'Hành', 'Rau thơm'],
    availability: true,
    preparation_time: 20,
    calories: 300
  }
]

export { dishes }
