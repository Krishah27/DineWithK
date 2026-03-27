import supabase from '@/lib/supabase'

export default async function Home() {
  const { data } = await supabase
    .from('dinewise')
    .select('*')

  // ✅ Extract unique cities
  const cities = [...new Set(
    data?.map((r: any) => r.location?.split(",").pop().trim())
  )]

  // ✅ Extract unique cuisines
  const cuisines = [...new Set(
    data?.flatMap((r: any) => r.cuisines || [])
  )]

  return (
    <div className="container">
      
      {/* Header */}
      <div className="header">
        <div className="title">
          <div className="logo">🍽️</div>
          <div>
            <h1>DineWise🍽️</h1>
            <div className="subtitle">
              Smart suggestions using Cuisine • Location • Rating
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="btn secondary">Reset</button>
        </div>
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="filters">

          {/* Restaurant */}
          <div className="field wide">
            <label className="label">Pick a restaurant you like</label>
            <select>
              {data?.map((r: any) => (
                <option key={r.id}>{r.restaurant_name}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="field">
            <label className="label">City</label>
            <select>
              <option>Any</option>
              {cities.map((c: string, i: number) => (
                <option key={i}>{c}</option>
              ))}
            </select>
          </div>

          {/* Cuisine */}
          <div className="field">
            <label className="label">Cuisine</label>
            <select>
              <option>Any</option>
              {cuisines.map((c: string, i: number) => (
                <option key={i}>{c}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="field">
            <label className="label">Min Rating</label>
            <select>
              <option value="0">Any</option>
              <option value="3.5">3.5</option>
              <option value="4.0">4.0</option>
              <option value="4.5">4.5</option>
            </select>
          </div>

          <div className="field">
            <button className="btn">Recommend</button>
          </div>

        </div>
      </div>

      {/* Results */}
      <div className="grid">
        {data?.map((r: any) => (
          <div key={r.id} className="card">
            
            <div className="rating">⭐ {r.rating}</div>

            <h3>{r.restaurant_name}</h3>

            <div className="cuisines">
              {r.cuisines ? r.cuisines.join(" • ") : "Various"}
            </div>

            <div className="chips">
              <span className="badge">📍 {r.location}</span>
              <span className="badge">💸 ₹{r.average_price}</span>
              <span className="badge">⏱ {r.average_delivery_time} mins</span>
            </div>

            <div className="actions">
              <button className="btn secondary">View</button>
              <button className="btn">Similar</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}