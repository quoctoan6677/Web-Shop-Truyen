export const adminInitialOrders = [
	{
		id: "DH001",
		customerName: "Phạm Quốc Toản",
		phone: "0328 322 623",
		address: "Bắc Từ Liêm, Hà Nội",
		total: 184000,
		status: "Đã giao",
		orderDate: "17/05/2026",
		items: [
			{ id: "SP001", name: "Doraemon tập 1", price: 24000, quantity: 2 },
			{ id: "SP004", name: "Nhà giả kim", price: 68000, quantity: 2 },
		],
	},
	{
		id: "DH002",
		customerName: "Nguyễn Minh Anh",
		phone: "0903 456 789",
		address: "Thanh Xuân, Hà Nội",
		total: 96000,
		status: "Đang giao hàng",
		orderDate: "16/05/2026",
		items: [
			{
				id: "SP002",
				name: "Thám tử lừng danh Conan tập 12",
				price: 28000,
				quantity: 1,
			},
			{
				id: "SP005",
				name: "Tuổi trẻ đáng giá bao nhiêu",
				price: 68000,
				quantity: 1,
			},
		],
	},
	{
		id: "DH003",
		customerName: "Trần Thu Hà",
		phone: "0987 654 321",
		address: "Hải Châu, Đà Nẵng",
		total: 1216000,
		status: "Chờ xác nhận",
		orderDate: "16/05/2026",
		items: [
			{ id: "SP006", name: "Combo Sherlock Holmes", price: 350000, quantity: 1 },
			{ id: "SP001", name: "Doraemon tập 1", price: 24000, quantity: 2 },
			{
				id: "SP002",
				name: "Thám tử lừng danh Conan tập 12",
				price: 28000,
				quantity: 3,
			},
			{
				id: "SP003",
				name: "Combo Harry Potter 7 tập",
				price: 890000,
				quantity: 1,
			},
			{ id: "SP004", name: "Nhà giả kim", price: 86000, quantity: 1 },
			{
				id: "SP005",
				name: "Tuổi trẻ đáng giá bao nhiêu",
				price: 78000,
				quantity: 2,
			},
		],
	},
	{
		id: "DH004",
		customerName: "Lê Hoàng Nam",
		phone: "0912 888 999",
		address: "Ninh Kiều, Cần Thơ",
		total: 420000,
		status: "Đang giao hàng",
		orderDate: "15/05/2026",
		items: [{ id: "SP006", name: "Combo Sherlock Holmes", price: 420000, quantity: 1 }],
	},
	{
		id: "DH005",
		customerName: "Vũ Khánh Linh",
		phone: "0868 123 456",
		address: "Biên Hòa, Đồng Nai",
		total: 78000,
		status: "Đã giao",
		orderDate: "15/05/2026",
		items: [
			{
				id: "SP005",
				name: "Tuổi trẻ đáng giá bao nhiêu",
				price: 78000,
				quantity: 1,
			},
		],
	},
];

export const adminOrderStatusOptions = [
	"Tất cả trạng thái",
	"Chờ xác nhận",
	"Đang giao hàng",
	"Đã giao",
];

export const adminOrderStatusOrder = {
	"Chờ xác nhận": 0,
	"Đang giao hàng": 1,
	"Đã giao": 2,
};

export const profileOrderHistory = [
	{
		id: "DH001",
		date: "14/05/2026",
		total: 184000,
		status: "Đã giao",
	},
	{
		id: "DH002",
		date: "09/05/2026",
		total: 96000,
		status: "Đang vận chuyển",
	},
	{
		id: "DH003",
		date: "02/05/2026",
		total: 245000,
		status: "Đã thanh toán",
	},
];

export const userInitialOrders = [
	{
		date: "17/05/2026",
		total: 184000,
		status: "Đã giao",
		items: [
			{ id: "SP001", name: "Doraemon tập 1", price: 24000, quantity: 2 },
			{ id: "SP004", name: "Nhà giả kim", price: 68000, quantity: 2 },
		],
	},
	{
		date: "16/05/2026",
		total: 96000,
		status: "Chờ xác nhận",
		items: [
			{
				id: "SP002",
				name: "Thám tử lừng danh Conan tập 12",
				price: 28000,
				quantity: 1,
			},
			{
				id: "SP005",
				name: "Tuổi trẻ đáng giá bao nhiêu",
				price: 68000,
				quantity: 1,
			},
		],
	},
	
];
