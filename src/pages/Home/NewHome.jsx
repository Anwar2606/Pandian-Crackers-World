import React, { useEffect, useState } from "react";
import "./NewHome.css";
import { 
    FaHome, FaInfoCircle, FaServicestack, FaEnvelope, 
    FaArrowAltCircleRight, FaArrowCircleLeft, FaEye, 
    FaEdit, FaFileInvoice, 
    FaTruck
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { Bar } from "react-chartjs-2";
import { 
    Chart as ChartJS, CategoryScale, LinearScale, 
    BarElement, Title, Tooltip, Legend 
} from "chart.js";
import { IoIosPerson } from "react-icons/io";
import { TbListNumbers } from "react-icons/tb";
import Logo from "../assets/PCW.png";
import Card1 from "../assets/card1.png";
import Card2 from "../assets/cardnew22.png";
import Card3 from "../assets/cardnew3.png";
import Card22 from "../assets/card22.png";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Ensure Firebase is properly configured
import SalesComparisonChart from "../Chart/SalesComparisonChart";
import { Link } from "react-router-dom";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NewHome = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [totalBills, setTotalBills] = useState(0);
    const [uniqueCustomers, setUniqueCustomers] = useState(0);
    const [todaySales, setTodaySales] = useState(0);
    const [monthSales, setMonthSales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(Array(12).fill(0)); // Monthly sales data
    useEffect(() => {
        // Function to fetch customer count
        const fetchCustomerCount = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "customer")); // Replace 'customer' with your collection name
            setUniqueCustomers(querySnapshot.size); // Set the number of documents
          } catch (error) {
            console.error("Error fetching customer data: ", error);
          }
        };
    
        fetchCustomerCount();
      }, []);

      useEffect(() => {
        const fetchTodaySales = async () => {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today
    
            // Query for today's records in the billing collection
            const todayBillingQuery = query(
                collection(db, "billing"), // 'billing' is the collection name
                where("date", ">=", startOfDay),
                where("date", "<=", endOfDay)
            );
    
            try {
                const querySnapshot = await getDocs(todayBillingQuery);
    
                // Calculate the total amount for today's sales
                let totalAmount = 0;
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    totalAmount += data.totalAmount || 0; // Sum up the totalAmount field
                });
    
                // Log the totalAmount to verify the calculation
                console.log("Today's Total Sales: ₹", totalAmount);
    
                setTodaySales(totalAmount); // Set the total sales for today
            } catch (error) {
                console.error("Error fetching today's sales: ", error);
            }
        };
    
        fetchTodaySales();
    }, []); // Empty dependency array ensures it runs once when the component mounts
    
    
    
    
    useEffect(() => {
        const fetchBills = async () => {
            try {
                const billsCollection = collection(db, "billing");
                const billsSnapshot = await getDocs(billsCollection);
    
               
            
                let totalSalesForMonth = 0;
                const monthlySalesTemp = Array(12).fill(0);
    
      
             
    
                billsSnapshot.forEach((doc) => {
                    const data = doc.data();
    
                    // Check if data.date exists and is valid
                    if (!data.date) {
                        console.warn("Missing or undefined date field for document:", doc.id);
                        return; // Skip this document
                    }
    
                    // Convert Firestore Timestamp or string to Date
                  
    
                    // const billDateStr = billDate.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
    
                    // Count unique customers
                   
    
                    // Today's sales
                  // Today's sales
                  
                    // Current month's sales
                  
                });
    
                // Update state with computed values
                setTotalBills(billsSnapshot.size);
             
                setMonthSales(totalSalesForMonth);
                setMonthlySales(monthlySalesTemp);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchBills();
    }, []);
    
    
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Chart data and options
    const chartData = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
        datasets: [
            {
                label: "Monthly Sales (₹)",
                data: monthlySales, // Data for the chart
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "12-Month Sales Comparison" },
        },
    };

    return (
        <div className="main-container">
            <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
                <ul>
                    <li style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '20px 0',
                        borderBottom: '2px solid #c3b6d0',
                        paddingBottom: '10px',
                    }}>
                        {isOpen ? (
                            'Pandian Crackers'
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '-14px' }}>
                                <img
                                    src={Logo}
                                    alt="Nandhini Fireworks Logo"
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                    }}
                                />
                            </div>
                        )}
                    </li>
                    <li><Link to="/newhome"><FaHome /> {isOpen && <span>Home</span>}</Link></li>
                    <li><Link to="/products"><AiFillProduct /> {isOpen && <span>Products</span>}</Link></li>    
                    <li><Link to="/allbills"><FaEye /> {isOpen && <span>All Bills</span>}</Link></li>
                    <li><Link to="/editbill"><FaEdit /> {isOpen && <span>Edit Bills</span>}</Link></li>
                    <li><Link to="/bill"><FaFileInvoice /> {isOpen && <span>Invoice</span>}</Link></li>
                     <li><Link to="/showcustomers"><IoIosPerson /> {isOpen && <span>Customers</span>}</Link></li>
                     <li><Link to="/showtransport"><FaTruck /> {isOpen && <span>Transport Details</span>}</Link></li>
                    <li><Link to="/invoice"><TbListNumbers />{isOpen && <span>Invoice Numbers</span>}</Link></li>
                    <li><Link to="/"><MdLogout /> {isOpen && <span>Logout</span>}</Link></li>
                    <li className="menu-item">
                        <button onClick={toggleSidebar} style={{
                            padding: '10px',
                            backgroundColor: '#1b2594',
                            border: 'none',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                        }}>
                            {isOpen ? <FaArrowCircleLeft style={{ color: 'white' }} /> : <FaArrowAltCircleRight style={{ color: 'white' }} />}
                        </button>
                        
                    </li>
                </ul>
            </div>
            <div className="content-container">
                <div className="card-container">
                    <div className="card">
                        <div className="text-container">
                            <h3>Total Bills</h3>
                            <p>{totalBills}</p>
                        </div>
                        <div className="image-container">
                            <img src={Card1} alt="Card 1" />
                        </div>
                    </div>
                    <div className="card">
                        <div className="text-container">
                            <h3>Customers</h3>
                            <p>{uniqueCustomers}</p>
                        </div>
                        <div className="image-container">
                            <img src={Card2} alt="Card 2" />
                        </div>
                    </div>
                    <div className="card">
                        <div className="text-container">
                            <h3>Today Sales</h3>
                            <p>₹{todaySales}</p>

                        </div>
                        <div className="image-container">
                            <img src={Card3} alt="Card 3" />
                        </div>
                    </div>
                    <div className="card">
                        <div className="text-container">
                            <h3>This Month</h3>
                            <p>₹{monthSales}</p>
                        </div>
                        <div className="image-container">
                            <img src={Card22} alt="Card 4" />
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "20px", padding: "20px", width: "95%", height: "400px" }}>
                    <SalesComparisonChart/>
                </div>
            </div>
        </div>
    );
};

export default NewHome;
