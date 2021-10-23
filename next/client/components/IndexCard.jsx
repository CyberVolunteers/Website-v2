import React from 'react'
const StyleSheet={
    Volenteer:{
        backgroundColor: "#f85220",
        border: "none",
        color: "#fff",
        padding: "1rem 2rem",
        fontSize: "1rem",
        cursor: "pointer",
        marginTop:"15px",
        width:"100%",
        fontWeight:"600"
    },
    SubTitle:{
        color: "rgb(156, 156, 156)",
        fontWeight: "400",
    },
    TotalGo:{
        color: "#f85220",  
        fontSize:"14px"
    },
    MeterTotal:{
        width: "100%",
        height: "5px",
        marginTop:" 10px",
        marginBottom:" 15px",
        backgroundColor: "#d8d8d8",
        position: "relative",
        borderRadius: "10px",
    },
    MeterCome:{
        width: "30%",
        backgroundColor: "#f85220",
        height: "100%",
        position: "absolute",
        left: "0",
        borderRadius:" 10px",
        top: "0",
    },
    Card:{
     
    }
}
function IndexCard({img,title,subtitle,desc,meternow,totalgo}) {
    return (
        <div className="card-wrapper" style={{padding:"3rem 1.5rem"}}>
              <div className="Card" style={{   boxShadow:"0 0.65rem 0.875rem 0.4375rem rgb(153 153 153 / 10%)",borderRadius:"10px"}}>
            <img src={img}  style={{width:"100%",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}}/>
          <div className="bottom" style={{borderBottomLeftRadius:"10px",borderBottomRightRadius:"10px",padding:"1.5rem 1rem",}}>
          <h3 className="title">{title}</h3>
            <p className="subtitle" style={StyleSheet.SubTitle}>{subtitle}  <span className="total-go" style={StyleSheet.TotalGo}>
                {totalgo}$ to go
            </span></p>
            <div className="meter-total" style={StyleSheet.MeterTotal}>
                <div className="meter" style={{width:`${meternow}%`,...StyleSheet.MeterCome}}></div>
            </div>
            <p className="description">
            {desc}

            <a href="#" style={{color:"#F85220"}}>Read more</a>
            </p>

         

           

            <div className="submittion-area dflex-align-center">
               

                <button className="lend-now" style={StyleSheet.Volenteer}>
                Volunteer Now
                </button>
            </div>
          </div>
        </div>
        </div>
    )
}

export default IndexCard
