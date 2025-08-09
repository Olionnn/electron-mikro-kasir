'use client'
import React, {useState, useEffect} from "react";
import { MdOutlineRefresh, MdOutlineSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import PosItemCard from "../../component/positemcard";
import PosCartItem from "../../component/poscartitem";
import { useNavigate } from "react-router-dom";

const Pos = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); 
    const navigate = useNavigate();

    // useEffect(() => {
    //   const loadedItems = JSON.parse(localStorage.getItem('items')) || [];
    //   setItems(loadedItems);
    // }, []);

    useEffect(() => {
      const fetchBarangList = async () => {
        const barangList = await window.electronAPI.getBarangList({
          pagination: { limit: 10, page: 1, sort: 'nama:ASC' },
          filter: { search: '', kategori_id: 1 }
        });
        
        console.log('Fetched Barang List:', barangList.data.items);
        setItems(barangList.data.items || []);
      };
    
      fetchBarangList();
    }, []);

  
    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + (item.hargaJual * item.quantity), 0);
        setTotalPrice(total);
    }, [cart]);

    const handleSimpanPesananClick = () => {
        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }
        
        navigate('/pesanan/tambah', {
            state: {
                cartItems: cart,
                totalPrice: totalPrice
            }
        });
    };

    const redirectToBuatPesanan = () => {

    }
    



    const handleAddItemToCart = (itemToAdd) => {
        const existingItem = cart.find(item => item.id === itemToAdd.id);

        if (existingItem) {
            if (existingItem.quantity < itemToAdd.stok) {
                setCart(cart.map(item => 
                    item.id === itemToAdd.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                ));
            }
        } else {
            if (itemToAdd.stok > 0) {
                setCart([...cart, { ...itemToAdd, quantity: 1 }]);
            }
        }
    };

    const handleRemoveItemFromCart = (itemIdToRemove) => {
        setCart(cart.filter(item => item.id !== itemIdToRemove));
    };
    
    const formatCurrency = (value) => 
        new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(value);

    const handleCheckoutClick = () => {
      if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
      }
    
      const orderData = {
        id: Date.now(), 
        customer: "Umum", 
        items: cart,
        total: totalPrice
      };
    
      localStorage.setItem('currentCheckout', JSON.stringify(orderData));
    
      navigate('/trx');
    };
  return (
    <div className="flex h-full">
      <div className="w-3/5 border-2 border-gray-100 bg-white p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center gap-4">
          <button className="bg-green-600 text-white p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="m15.7 14.3l-4.2-4.2c-.2-.2-.5-.3-.8-.3c.8-1 1.3-2.4 1.3-3.8c0-3.3-2.7-6-6-6S0 2.7 0 6s2.7 6 6 6c1.4 0 2.8-.5 3.8-1.4c0 .3 0 .6.3.8l4.2 4.2c.2.2.5.3.7.3s.5-.1.7-.3c.4-.3.4-.9 0-1.3zM6 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5s4.5 2 4.5 4.5s-2 4.5-4.5 4.5z"
              />
            </svg>
          </button>
          <button className="bg-gray-300 text-white p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 768 644"
            >
              <path
                fill="currentColor"
                d="M0 644h25V50H0v594zm75 0h49V50H75v594zm98 0h50V50h-50v594zm99 0h100V50H272v594zm149 0h75V50h-75v594zm124 0h50V50h-50v594zm99 0h25V50h-25v594zm75 0h49V50h-49v594z"
              />
            </svg>
          </button>
          <div className="flex items-center flex-1 border px-6 py-3 rounded-full text-lg">
            <MdOutlineSearch size={30} />
            <input
              type="text"
              placeholder="Cari Barang"
              className="flex-1 outline-none"
            />
          </div>

          <button className="flex gap-3 text-2xl">
            Refresh <MdOutlineRefresh size={30} className="" />
          </button>
        </div>

        <div className="flex gap-4">
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">
            Semua
          </button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">
            + Ctrl + T
          </button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">
            📋 Ctrl + J
          </button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">
            🖨 Ctrl + P
          </button>
        </div>

        <div className="flex flex-col gap-2">
            {items.map((item, index) => (
                <PosItemCard 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    onAddItem={handleAddItemToCart} // Kirim fungsi ke card
                />
            ))}
            <Link to="/barang/tambah" className="flex items-center text-left  px-3 py-3 rounded-lg w-fit text-green-600 text-xl">
                <span className="text-3xl mr-3 bg-green-50 rounded-lg w-12 h-12 p-1 text-center">+</span> Tambah Barang Baru
            </Link>
        </div>
      </div>

      <div className="w-2/5 bg-white border-2 border-gray-100 flex flex-col justify-between">
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex gap-10 border-b pb-4 text-lg">
            <span>Diskon : %</span>
            <span>Pajak : %</span>
          </div>
          {cart.length === 0 ? (
            <div className="mt-6 text-gray-400 text-xl">(daftar item muncul di sini)</div>
          ) : (
            <div className="mt-4">
              {cart.map((cartItem, index) => (
                <PosCartItem key={cartItem.id} item={cartItem} index={index} onRemove={handleRemoveItemFromCart} />
              ))}
            </div>
          )}
        </div>
        <div className="p-1 bg-gray-100 w-full ">
          <div className="flex items-center justify-between gap-2 text-lg w-full bg-white">
              <div className="w-1/2 p-3" >

                  <button className="flex gap-3">
                  <span>Potensi Untung</span>
                  <HiOutlineQuestionMarkCircle size={30} />
                  </button>
              </div>


              <button className="w-1/2 h-[70px] bg-teal-100 text-teal-800 px-3   border border-teal-600 text-lg">
                Lihat Promosi
              </button>

          </div>
          <div className="flex gap-10 items-center p-5">
            <button onClick={handleSimpanPesananClick} className="w-2xl bg-white border border-green-600 text-green-600 px-8 py-3 rounded text-lg">
              Simpan Pesanan
            </button>
            <button 
              onClick={handleCheckoutClick}
              className="w-2xl bg-green-600 text-white px-8 py-3 rounded text-lg"
            >
              Rp.{formatCurrency(totalPrice)} Bayar
            </button>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default Pos;