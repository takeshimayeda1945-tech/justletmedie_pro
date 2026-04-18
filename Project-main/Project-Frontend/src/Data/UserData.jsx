const users = [
    {
        id: 1,
        userId: 'U001',
        name: 'สมชาย ใจดี',
        role: 'Seller',
        address: 'สมุทรปราการ',
        phone: '0999999999',
        email: 'KlTtD@example.com',
        profile: 'https://i.pravatar.cc/150?img=1',
        idCard: 'https://picsum.photos/300/200?random=11'
    },
    {
        id: 2,
        userId: 'U002',
        name: 'สมหญิง รักดี',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=2',
        idCard: 'https://picsum.photos/300/200?random=12'
    },
    {
        id: 3,
        userId: 'U003',
        name: 'อนันต์ มั่งมี',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=3',
        idCard: 'https://picsum.photos/300/200?random=13'
    },
    {
        id: 4,
        userId: 'U004',
        name: 'กมลวรรณ สุขใจ',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=4',
        idCard: 'https://picsum.photos/300/200?random=14'
    },
    {
        id: 5,
        userId: 'U005',
        name: 'ชาญชัย พันธุ์ดี',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=5',
        idCard: 'https://picsum.photos/300/200?random=15'
    },
    {
        id: 6,
        userId: 'U006',
        name: 'สุพัตรา มีสุข',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=6',
        idCard: 'https://picsum.photos/300/200?random=16'
    },
    {
        id: 7,
        userId: 'U007',
        name: 'วรากร ตั้งใจ',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=7',
        idCard: 'https://picsum.photos/300/200?random=17'
    },
    {
        id: 8,
        userId: 'U008',
        name: 'มณีรัตน์ สดใส',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=8',
        idCard: 'https://picsum.photos/300/200?random=18'
    },
    {
        id: 9,
        userId: 'U009',
        name: 'พงศกร จิตดี',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=9',
        idCard: 'https://picsum.photos/300/200?random=19'
    },
    {
        id: 10,
        userId: 'U010',
        name: 'สุทธิดา น่ารัก',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=10',
        idCard: 'https://picsum.photos/300/200?random=20'
    },
    {
        id: 11,
        userId: 'U011',
        name: 'กิตติศักดิ์ แก้วใส',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=11',
        idCard: 'https://picsum.photos/300/200?random=21'
    },
    {
        id: 12,
        userId: 'U012',
        name: 'ปวีณา รัตน์รุ่ง',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=12',
        idCard: 'https://picsum.photos/300/200?random=22'
    },
    {
        id: 13,
        userId: 'U013',
        name: 'ณัฐพล พูนทรัพย์',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=13',
        idCard: 'https://picsum.photos/300/200?random=23'
    },
    {
        id: 14,
        userId: 'U014',
        name: 'อรอนงค์ อิ่มสุข',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=14',
        idCard: 'https://picsum.photos/300/200?random=24'
    },
    {
        id: 15,
        userId: 'U015',
        name: 'ธีรเดช ใจงาม',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=15',
        idCard: 'https://picsum.photos/300/200?random=25'
    },
    {
        id: 16,
        userId: 'U016',
        name: 'สุดารัตน์ สายทอง',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=16',
        idCard: 'https://picsum.photos/300/200?random=26'
    },
    {
        id: 17,
        userId: 'U017',
        name: 'วรพงษ์ อินทร',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=17',
        idCard: 'https://picsum.photos/300/200?random=27'
    },
    {
        id: 18,
        userId: 'U018',
        name: 'พิมพ์ชนก วงศ์ดี',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=18',
        idCard: 'https://picsum.photos/300/200?random=28'
    },
    {
        id: 19,
        userId: 'U019',
        name: 'ศุภชัย เก่งกล้า',
        role: 'Seller',
        profile: 'https://i.pravatar.cc/150?img=19',
        idCard: 'https://picsum.photos/300/200?random=29'
    },
    {
        id: 20,
        userId: 'U020',
        name: 'อัญชัน สุขสันต์',
        role: 'Buyer',
        profile: 'https://i.pravatar.cc/150?img=20',
        idCard: 'https://picsum.photos/300/200?random=30'
    }
];

export const fetchUsers = () => {
    return users.slice(0, 20);
}
