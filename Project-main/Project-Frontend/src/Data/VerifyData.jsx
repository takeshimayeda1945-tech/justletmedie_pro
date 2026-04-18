const verifyusers = [
     {
        id: 21,
        userId: 'U021',
        name: 'กิตติพงษ์ แสงทอง',
        role: 'Seller',
        address: 'กรุงเทพมหานคร',
        phone: '0881112233',
        email: 'kpong21@example.com',
        profile: 'https://i.pravatar.cc/150?img=21',
        idCard: 'https://picsum.photos/300/200?random=21'
    },
    {
        id: 22,
        userId: 'U022',
        name: 'จิรายุส อินทรชัย',
        role: 'Seller',
        address: 'นครปฐม',
        phone: '0812223344',
        email: 'jirayut22@example.com',
        profile: 'https://i.pravatar.cc/150?img=22',
        idCard: 'https://picsum.photos/300/200?random=22'
    },
    {
        id: 23,
        userId: 'U023',
        name: 'พชร พูลสิน',
        role: 'Seller',
        address: 'เชียงใหม่',
        phone: '0823334455',
        email: 'patchara23@example.com',
        profile: 'https://i.pravatar.cc/150?img=23',
        idCard: 'https://picsum.photos/300/200?random=23'
    },
    {
        id: 24,
        userId: 'U024',
        name: 'ชลธิชา วรรณดี',
        role: 'Seller',
        address: 'ขอนแก่น',
        phone: '0834445566',
        email: 'chonlathicha24@example.com',
        profile: 'https://i.pravatar.cc/150?img=24',
        idCard: 'https://picsum.photos/300/200?random=24'
    },
    {
        id: 25,
        userId: 'U025',
        name: 'พัสกร รัตนไพศาล',
        role: 'Seller',
        address: 'ชลบุรี',
        phone: '0845556677',
        email: 'patsakorn25@example.com',
        profile: 'https://i.pravatar.cc/150?img=25',
        idCard: 'https://picsum.photos/300/200?random=25'
    },
    {
        id: 26,
        userId: 'U026',
        name: 'ศราวุธ คำดี',
        role: 'Seller',
        address: 'อุดรธานี',
        phone: '0856667788',
        email: 'sarawut26@example.com',
        profile: 'https://i.pravatar.cc/150?img=26',
        idCard: 'https://picsum.photos/300/200?random=26'
    },
    {
        id: 27,
        userId: 'U027',
        name: 'ณัฐกานต์ สมบุญ',
        role: 'Seller',
        address: 'นครราชสีมา',
        phone: '0867778899',
        email: 'natthakan27@example.com',
        profile: 'https://i.pravatar.cc/150?img=27',
        idCard: 'https://picsum.photos/300/200?random=27'
    },
    {
        id: 28,
        userId: 'U028',
        name: 'อัครเดช พงศ์ภักดี',
        role: 'Seller',
        address: 'สงขลา',
        phone: '0878889900',
        email: 'akkharadet28@example.com',
        profile: 'https://i.pravatar.cc/150?img=28',
        idCard: 'https://picsum.photos/300/200?random=28'
    },
    {
        id: 29,
        userId: 'U029',
        name: 'ทวิช กิตตินันท์',
        role: 'Seller',
        address: 'สุราษฎร์ธานี',
        phone: '0899991122',
        email: 'tawit29@example.com',
        profile: 'https://i.pravatar.cc/150?img=29',
        idCard: 'https://picsum.photos/300/200?random=29'
    },
    {
        id: 30,
        userId: 'U030',
        name: 'คณาวุฒิ ศรีทอง',
        role: 'Seller',
        address: 'ภูเก็ต',
        phone: '0810101010',
        email: 'kanawut30@example.com',
        profile: 'https://i.pravatar.cc/150?img=30',
        idCard: 'https://picsum.photos/300/200?random=30'
    }
]

export const fetchVerifyUsers = () => {
    return verifyusers.slice(0, 10);
}