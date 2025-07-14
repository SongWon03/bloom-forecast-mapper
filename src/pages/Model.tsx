import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Snowflake, Flower, ExternalLink, Github } from "lucide-react";

export default function Model() {
  const steps = [
    {
      icon: <Snowflake className="w-8 h-8 text-blue-500" />,
      title: "Chill Accumulation",
      subtitle: "저온 누적",
      description: "겨울철 저온 기간 동안 식물이 휴면을 깨기 위해 필요한 차가운 온도를 누적하는 단계입니다.",
      details: "일반적으로 0-7.2°C 범위의 온도가 가장 효과적입니다."
    },
    {
      icon: <Thermometer className="w-8 h-8 text-orange-500" />,
      title: "Heat Accumulation", 
      subtitle: "열 누적",
      description: "충분한 저온을 경험한 후, 식물이 개화하기 위해 필요한 온도를 누적하는 단계입니다.",
      details: "기준 온도(보통 4-6°C) 이상의 온도를 적산합니다."
    },
    {
      icon: <Flower className="w-8 h-8 text-pink-500" />,
      title: "Bloom Prediction",
      subtitle: "개화 예측",
      description: "저온 누적과 열 누적이 임계값에 도달하면 개화 시기를 예측할 수 있습니다.",
      details: "종별로 다른 임계값을 적용하여 정확도를 높입니다."
    }
  ];

  const features = [
    "기상청 실시간 기온 데이터 활용",
    "지역별 미기후 특성 반영",
    "머신러닝 기반 매개변수 최적화",
    "95% 신뢰구간 제공",
    "과거 관측 데이터와 검증"
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">What is Chill-Day Model?</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Chill-Day 모델은 식물의 개화 시기를 예측하는 생태학적 모델입니다.
          겨울철 저온 누적과 봄철 열 누적을 통해 정확한 개화일을 예측합니다.
        </p>
      </div>

      {/* Model Steps */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">모델 작동 원리</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription className="text-base font-medium">
                  {step.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{step.description}</p>
                <p className="text-sm text-muted-foreground italic">{step.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Model Flow Diagram */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-blue-50 to-pink-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">모델 흐름도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8 py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mb-2">
                  ❄️
                </div>
                <p className="font-medium">겨울철 저온</p>
                <p className="text-sm text-muted-foreground">Chill Hours</p>
              </div>
              
              <div className="text-2xl text-muted-foreground">→</div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl mb-2">
                  🌡️
                </div>
                <p className="font-medium">봄철 온도</p>
                <p className="text-sm text-muted-foreground">Heat Units</p>
              </div>
              
              <div className="text-2xl text-muted-foreground">→</div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-2">
                  🌸
                </div>
                <p className="font-medium">개화 예측</p>
                <p className="text-sm text-muted-foreground">Bloom Date</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">모델 특징</h2>
        <div className="max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center mb-4">
              <div className="w-2 h-2 bg-primary rounded-full mr-4"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Species Comparison */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">종별 개화 특성</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🌸</span>
                벚꽃
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><Badge variant="secondary">저온 요구도</Badge> 높음</p>
                <p><Badge variant="secondary">열 요구도</Badge> 중간</p>
                <p><Badge variant="secondary">개화 기간</Badge> 3-4월</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🌼</span>
                개나리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><Badge variant="secondary">저온 요구도</Badge> 중간</p>
                <p><Badge variant="secondary">열 요구도</Badge> 낮음</p>
                <p><Badge variant="secondary">개화 기간</Badge> 3월</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🌺</span>
                진달래
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><Badge variant="secondary">저온 요구도</Badge> 높음</p>
                <p><Badge variant="secondary">열 요구도</Badge> 높음</p>
                <p><Badge variant="secondary">개화 기간</Badge> 4-5월</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Links */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">더 알아보기</h2>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <a href="https://github.com/phenofact/chill-day-model" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub Repository
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://doi.org/10.1000/phenofact" target="_blank" rel="noopener noreferrer">
              <span className="mr-2">📄</span>
              Research Paper
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}