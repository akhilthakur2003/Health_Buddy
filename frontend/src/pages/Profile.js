import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"

const Profile = () => {
    const { user } = useAuthContext()
    
    // Form fields state
    const [username, setUsername] = useState('')
    const [mobile, setMobile] = useState('')
    const [address, setAddress] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [fitnessGoal, setFitnessGoal] = useState('Maintenance')
    const [activityLevel, setActivityLevel] = useState('Moderate')
    
    const [bmi, setBmi] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)

    // Fetch existing profile data when the page loads
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                setUsername(json.username || '')
                setMobile(json.mobile || '')
                setAddress(json.address || '')
                setHeight(json.height || '')
                setWeight(json.weight || '')
                setFitnessGoal(json.fitnessGoal || 'Maintenance')
                setActivityLevel(json.activityLevel || 'Moderate')
            }
        }

        if (user) {
            fetchProfile()
        }
    }, [user])

    // Automatically calculate BMI whenever height or weight changes
    useEffect(() => {
        if (height > 0 && weight > 0) {
            // Formula: weight (kg) / [height (m)]²
            const heightInMeters = height / 100
            const calculatedBmi = weight / (heightInMeters * heightInMeters)
            setBmi(calculatedBmi.toFixed(1)) // Keep 1 decimal place
        } else {
            setBmi(null)
        }
    }, [height, weight])

    // Submit updated metrics to the backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setMessage('')

        const updatedProfile = { username, mobile, address, height, weight, fitnessGoal, activityLevel }

        const response = await fetch('/api/user/profile', {
            method: 'PATCH',
            body: JSON.stringify(updatedProfile),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setMessage('Profile updated successfully!')
        }
    }

    // Quick helper to determine health summary categorization based on BMI score
    const getBmiCategory = (bmiScore) => {
        if (!bmiScore) return ''
        if (bmiScore < 18.5) return 'Underweight 🟡'
        if (bmiScore < 24.9) return 'Normal weight ✨'
        if (bmiScore < 29.9) return 'Overweight 🟠'
        return 'Obese 🔴'
    }

    return (
        <div className="profile-page">
            <form className="profile-form" onSubmit={handleSubmit}>
                <h3>Your Health & Fitness Profile</h3>
                
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Mobile Number:</label>
                    <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="grid-inputs">
                    <div>
                        <label>Height (cm):</label>
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" />
                    </div>
                    <div>
                        <label>Weight (kg):</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Fitness Goal:</label>
                    <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Endurance">Endurance training</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                <button type="submit">Save Profile Parameters</button>
                
                {message && <div className="success-msg">{message}</div>}
                {error && <div className="error">{error}</div>}
            </form>

            {/* Health Summary Dashboard Card */}
            <div className="health-summary-card">
                <h3>Health Summary</h3>
                <div className="summary-stat">
                    <span>Calculated BMI:</span>
                    <strong>{bmi ? bmi : '--'}</strong>
                </div>
                {bmi && (
                    <div className="summary-stat">
                        <span>Classification:</span>
                        <span className="bmi-badge">{getBmiCategory(bmi)}</span>
                    </div>
                )}
                <p className="hint-text">
                    This biometric profile data provides vital context used by our AI integration to build targeted schedules safely.
                </p>
            </div>
        </div>
    )
}

export default Profile