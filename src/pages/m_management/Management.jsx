import React from 'react';
import { Link } from 'react-router-dom';
import { BiCategory, BiBox, BiUser,BiPackage,BiSolidDiscount,BiMoneyWithdraw, BiMoney, BiSolidOffer } from "react-icons/bi";
import { 
  FaBoxes,        
} from 'react-icons/fa';
import { 
  MdInventory,    // Clipboard dengan checkmark
  MdWarehouse,    // Warehouse building
  MdStorage,      // Storage/database icon
} from 'react-icons/md';
import { useNavbar } from '../../hooks/useNavbar';


export default function ManagementPage() {
  useNavbar({ variant: "page", title: "Management", backTo: null,  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {[
          { icon: <BiBox size={30} />, label: 'Barang atau Jasa', link: '/barang-jasa' },
          { icon: <BiCategory size={30}/>, label: 'Kategori Barang', link: '/kategori-barang' },
          { icon: <BiUser size={30}/>, label: 'Pelanggan', link: '/pelanggan' },
          { icon: <BiPackage size={30}/>, label: 'Supplier', link: '/supplier' },
          { icon: <BiSolidDiscount size={30}/>, label: 'Diskon', link: '/diskon' },
          { icon: <BiMoneyWithdraw size={30}/>, label: 'Pajak', link: '/pajak' },
          { icon: <BiMoney size={30}/>, label: 'Biaya', link: '/biaya' },
          { icon: <FaBoxes size={30}/>, label: 'Stok', link: '/stok' },
          { icon: <MdStorage size={30}/>, label: 'Stok Opname', link: '/stokopname' },
          { icon: <BiSolidOffer size={30}/>, label: 'Promosi Events', link: '/promosi' },
        ].map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="p-6 rounded-lg shadow-md border flex flex-col items-start gap-4 hover:shadow-lg transition bg-white text-lg font-semibold text-green-700 border-green-200"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
