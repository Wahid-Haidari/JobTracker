import { useState, useEffect } from "react";
import axios from "axios";
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
            const response = await axios.get("http://127.0.0.1:8000/applications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
            const response = await axios.post("http://127.0.0.1:8000/applications", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert(response.data.message);
            fetchApplications();  // Refresh the list after adding a new application
        } catch (error) {
          alert("Failed to enter: " + error.response.data.detail);
        }
      };


    return(
        <div>
            <h1>Add a new application</h1>
            <form onSubmit={handleEnter}>
                <input
                    type="text"
                    placeholder="Company name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
                 <input
                    type="text"
                    placeholder="Applied date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="How did you apply?"
                    value={form.application_location}
                    onChange={(e) => setForm({ ...form, application_location: e.target.value })}
                />
                 <input
                    type="text"
                    placeholder="Recruiter Name"
                    value={form.recruiter}
                    onChange={(e) => setForm({ ...form, recruiter: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Recruiter Contact"
                    value={form.recruiter_contact}
                    onChange={(e) => setForm({ ...form, recruiter_contact: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <button>Enter</button>
            </form>

            <h2>Your Applications</h2>
            <table>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Date</th>
                        <th>Application Location</th>
                        <th>Recruiter</th>
                        <th>Recruiter Contact</th>
                        <th>Status</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <tr key={app.id}>
                            <td>{app.company}</td>
                            <td>{app.position}</td>
                            <td>{app.date}</td>
                            <td>{app.application_location}</td>
                            <td>{app.recruiter}</td>
                            <td>{app.recruiter_contact}</td>
                            <td>{app.status}</td>
                            <td>{app.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
        
    )
}

export default Applications;