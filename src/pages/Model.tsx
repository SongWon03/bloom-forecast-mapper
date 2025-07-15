import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Thermometer, Snowflake, Sun, Flower } from "lucide-react";

export default function Model() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">What is Chill-Day Model?</h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          <b>Chill-Day Model</b>은 겨울철 저온(Chill)과 봄철 누적 온도(Heat, Day)를 함께 고려하여 벚꽃, 개나리, 진달래 등 다양한 식물의 개화 시기를 예측하는 국내 최적화 생태 모델입니다.
        </p>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mt-4">
          <b>pyCDM4F</b>는 이 모델을 누구나 쉽게 활용할 수 있도록 만든 오픈소스 Python 패키지로, <b>내장 데이터</b>와 <b>직접 커스터마이징한 기상·생육 데이터</b> 모두를 지원합니다.
        </p>
        <p className="text-base text-primary font-semibold mt-4">
          Chill-Day Model은 단순한 공식이 아니라, 실제 관측 데이터와 과학적 근거에 기반하여 한국 지역에서 가장 높은 예측 정확도를 보입니다.
        </p>
        <div className="flex justify-center mt-6">
          <Button variant="outline" asChild>
            <a href="https://wikidocs.net/book/17034" target="_blank" rel="noopener noreferrer">
              📘 pyCDM4F 공식 설명서 (위키독스)
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>

      {/* Model Principle */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Chill-Day Model의 원리</h2>
        <div className="max-w-4xl mx-auto text-lg leading-relaxed text-center mb-8">
          <p className="mb-6">
            Chill-Day Model은 식물의 휴면 타파(저온 요구 충족)와 생장 개시(온도 누적)를 모두 반영합니다.
          </p>
          <p className="mb-6">
            <b>1) Chill(저온) 누적</b>: 겨울 동안 일정 온도(0~7.2°C) 이하의 시간이 충분히 쌓이면 식물의 휴면이 해제됩니다.
          </p>
          <p className="mb-6">
            <b>2) Heat(온도) 누적</b>: 휴면이 풀린 뒤, 일정 기준 이상의 온도가 누적되면 개화가 시작됩니다.
          </p>
          <p className="mb-6">
            이 두 단계를 수식으로 계산하여, 각 지역·연도별로 실제 개화일을 예측합니다.
          </p>
          <p className="mb-6">
            pyCDM4F는 <b>내장된 전국 관측 데이터</b>와 <b>직접 수집한 기상·생육 데이터</b> 모두를 활용할 수 있으며, <b>예측 결과의 평가</b>와 <b>시각화</b> 기능도 제공합니다.
          </p>
        </div>
        
        {/* Visual Representation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chill Phase */}
            <Card className="text-center p-6 border-2 border-blue-200 bg-blue-50/30">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Snowflake className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">Chill 누적</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                0~7.2°C 저온 시간 누적<br />
                식물 휴면 해제
              </p>
            </Card>

            {/* Heat Phase */}
            <Card className="text-center p-6 border-2 border-orange-200 bg-orange-50/30">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Sun className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-orange-800">Heat 누적</h3>
              <p className="text-sm text-orange-700 leading-relaxed">
                기준 온도 이상 누적<br />
                생장 개시 준비
              </p>
            </Card>

            {/* Bloom Phase */}
            <Card className="text-center p-6 border-2 border-pink-200 bg-pink-50/30">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <Flower className="w-8 h-8 text-pink-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-pink-800">개화</h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                충분한 온도 누적<br />
                꽃이 피어남
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">pyCDM4F 주요 기능</h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 text-lg leading-relaxed">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p><b>내장 데이터셋</b>과 <b>사용자 커스텀 데이터</b> 모두 지원</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p>Chill-Day 공식 기반 <b>개화·발아 예측</b> 및 <b>결과 평가</b></p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p><b>시각화, 클러스터링, t-SNE</b> 등 다양한 분석 도구 제공</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p>전국/지역별/종별 <b>정확도 평가</b></p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p>오픈소스, 연구·실무·교육 등 다양한 활용 가능</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-base text-primary font-semibold text-center">
              예측 결과는 2025년 기준, 공식 기상청 예보와 유사하거나 더 높은 정확도를 보였으며, 울릉도 등 특수 지역도 지원합니다.
            </p>
          </div>
        </div>
      </section>

      {/* How to use & Contact */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">활용 예시 및 문의</h2>
        <div className="max-w-3xl mx-auto text-lg leading-relaxed text-center">
          <p className="mb-6">
            pyCDM4F는 <b>연구, 실무, 교육, 시민과학, SNS 공유</b> 등 다양한 목적으로 활용되고 있습니다.
          </p>
          <p className="mb-6">
            <b>직접 데이터 커스터마이징</b> 및 <b>코드 예제</b>는 공식 설명서에서 자세히 안내합니다.
          </p>
          <p className="text-base text-primary font-semibold mb-6">
            질문, 버그, 개선 요청 등은 언제든 공식 이메일로 문의해 주세요.
          </p>
          <div className="mb-6 space-y-2">
            <a href="mailto:rsw147362@gmail.com" className="block underline text-blue-600 hover:text-blue-800 transition-colors">
              rsw147362@gmail.com
            </a>
            <a href="mailto:kimsongwon10@korea.ac.kr" className="block underline text-blue-600 hover:text-blue-800 transition-colors">
              kimsongwon10@korea.ac.kr
            </a>
          </div>
          <Button variant="outline" asChild>
            <a href="https://wikidocs.net/book/17034" target="_blank" rel="noopener noreferrer">
              📘 pyCDM4F 공식 설명서 바로가기
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}