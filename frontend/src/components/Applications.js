import { useState, useEffect } from "react";
import { api } from "../api";
function Applications(){

    const [form, setForm] = useState({ 
        company: "", position: "", date:"", application_location:"", recruiter:"", recruiter_contact:"", status:"", notes:""});

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            // const response = await axios.get("http://127.0.0.1:8000/applications", {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            const response = await api.get("/applications");
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            alert("Failed to fetch applications. Please log in again.");
        }
    };

    

    const handleEnter = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // const response = await axios.post("http://127.0.0.1:8000/applications", form, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            const response = await api.post("/applications", form);

            alert(response.data.message);
            fetchApplications();  // Refresh the list after adding a new application
        } catch (error) {
          alert("Failed to enter: " + error.response.data.detail);
        }
      };


    return(
        <div>
            <h1 className='mt-10 text-3xl my-3'>Add a new application</h1>
            <form onSubmit={handleEnter} className='flex flex-wrap gap-2 p-2'>
                <input
                    type="text"
                    placeholder="Company name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                 <input
                    type="text"
                    placeholder="Applied date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                <input
                    type="text"
                    placeholder="How did you apply?"
                    value={form.application_location}
                    onChange={(e) => setForm({ ...form, application_location: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                 <input
                    type="text"
                    placeholder="Recruiter Name"
                    value={form.recruiter}
                    onChange={(e) => setForm({ ...form, recruiter: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />

                <input
                    type="text"
                    placeholder="Recruiter Contact"
                    value={form.recruiter_contact}
                    onChange={(e) => setForm({ ...form, recruiter_contact: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                <input
                    type="text"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className='flex-1 py-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
                />
                <button className="bg-myDarkGreen text-white ml-2 py-1 px-3
            text-sm rounded transition-transform duration-200 hover:scale-110 font-semibold">Enter</button>
            </form>

            <h2 className="mt-5 text-3xl my-3">Your applications</h2>
            <table className="min-w-full bg-white">
                {/* Table Header */}
                <thead className="bg-myDarkGreen text-white">
                    <tr>
                        <th className="py-3 px-4 border-b text-left font-semibold">Company</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Position</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Date</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Application Location</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Recruiter</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Recruiter Contact</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Status</th>
                        <th className="py-3 px-4 border-b text-left font-semibold">Notes</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 border-b text-black">{app.company}</td>
                        <td className="py-3 px-4 border-b text-black">{app.position}</td>
                        <td className="py-3 px-4 border-b text-black">{app.date}</td>
                        <td className="py-3 px-4 border-b text-black">{app.application_location}</td>
                        <td className="py-3 px-4 border-b text-black">{app.recruiter}</td>
                        <td className="py-3 px-4 border-b text-black">{app.recruiter_contact}</td>
                        <td className="py-3 px-4 border-b text-black">{app.status}</td>
                        <td className="py-3 px-4 border-b text-black">{app.notes}</td>
                    </tr>
                    ))}
                </tbody>
            </table>    
        </div>
        
    )
}

export default Applications;